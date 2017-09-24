import { Client as Discogs } from 'disconnect';
import {
  DISCOGS_CONSUMER_KEY,
  DISCOGS_CONSUMER_SECRET
} from './config';

async function loadCollection(oauthAccessData, username) {
  const col = new Discogs(oauthAccessData).user().collection();

  // load pages
  const firstPage = await loadCollectionPage(col, username, 1);

  const promises = [];
  for (let i = 2; i <= firstPage.pages; i++) {
    promises.push(loadCollectionPage(col, username, i));
  }
  const pages = await Promise.all(promises);
  pages.unshift(firstPage);

  // flatten album pages
  return pages.reduce((acc, cur) => acc.concat(cur.albums), []);
}

async function loadCollectionPage(col, username, page) {
  const result = await col.getReleases(username, 0, { page, per_page: 100 });

  console.log(`Loaded page ${page} from ${username}'s collection`);

  return {
    albums: result.releases.map(release => ({
        id: release.instance_id,
        releaseId: release.id,
        artist: getSingleNameFromArtists(release.basic_information.artists),
        title: release.basic_information.title,
        year: release.basic_information.year,
        thumb: release.basic_information.thumb,
        rating: release.rating,
        dateAdded: release.date_added,
        folderId: release.folder_id,
      })
    ),
    pages: result.pagination.pages
  };
}

function prepareTrack(track) {
  if (track.artists) {
    track.artist = getSingleNameFromArtists(track.artists);
  }
  delete track.artists;
  if (track.sub_tracks) {
    track.sub_tracks = track.sub_tracks.map(prepareTrack);
  }
  return track;
}

function getSingleNameFromArtists(artists) {
  if (!artists || artists.length === 0) {
    return '(unknown)'
  }
  return artists[0].name.replace(/^(.+) \([0-9]+\)$/, '$1');
}

async function loadUser(oauthAccessData, username) {
  const usr = new Discogs(oauthAccessData).user();
  const profile = await usr.getProfile(username);
  const col = usr.collection();
  const { folders } = await col.getFolders(username);

  return {
    username,
    name: profile.name,
    avatarURL: profile.avatar_url,
    numCollection: profile.num_collection,
    folders
  };
}

async function loadRelease(releaseId) {
  const db = new Discogs().database();
  const release = await db.getRelease(releaseId);
  return {
    id: release.id,
    artist: getSingleNameFromArtists(release.artists),
    title: release.title,
    year: release.year,
    thumb: release.thumb,
    labels: release.labels.map(l => l.name),
    country: release.country,
    genres: release.genres,
    styles: release.styles,
    tracks: release.tracklist.map(prepareTrack),
  };
}

function loadRequestToken(callbackUrl) {
  const oAuth = new Discogs().oauth();
  return new Promise((resolve, reject) => {
    oAuth.getRequestToken(
      DISCOGS_CONSUMER_KEY,
      DISCOGS_CONSUMER_SECRET,
      callbackUrl,
      (err, requestToken) => {
        if (err) {
          return reject(err);
        }
        return resolve(requestToken);
      }
    )
  });
}

function authenticate(oauthRequestToken, oauthVerifier) {
  const oAuth = new Discogs(oauthRequestToken).oauth();
  return new Promise((resolve, reject) => {
    oAuth.getAccessToken(oauthVerifier, (err, accessData) => {
      if (err) {
        return reject(err);
      }
      // get identity
      const dis = new Discogs(accessData);
      return resolve(dis.getIdentity().then(data => {
        return {
          username: data.username,
          token: accessData
        };
      }));
    });
  });
}

export default {
  loadCollection,
  loadRelease,
  loadUser,
  loadRequestToken,
  authenticate
}
