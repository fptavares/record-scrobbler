import discogs from './discogs-client';
import db from './datastore-client';

/*
 * Authentication
 */

export function getOauthRequestToken(callbackUrl) {
  // Authenticate by consumer key and secret
  return discogs.loadRequestToken(callbackUrl);
}

export function authenticate(oauthRequestToken, oauthVerifier) {
  return discogs.authenticate(oauthRequestToken, oauthVerifier);
}

/*
 * Discogs User
 */

export function getDiscogsUser(oauthToken, username) {
  return db.getUser(username);
}

/*
 * Discogs User Collection
 */

export async function getDiscogsCollection(oauth, username, folder, search, from, size=30) {
  if (!username) {
    throw new Error("Missing username!");
  }

  // execute query
  const results = await db.queryCollection(
    username,
    parseInt(folder),
    search,
    from,
    parseInt(size)
  );

  // load collection if it's an unfiltered first request
  if ((!results.albums || results.albums.length === 0) && !from && !search && !folder) {
    console.log('Collection doesn\'t exist in the database:', username);
    // load Discogs user and collection
    await loadUserCollectionFromDiscogs(oauth, username);
    // re-execute query
    return db.queryCollection(
      username,
      parseInt(folder),
      search,
      from,
      parseInt(size)
    );
  }

  // return collection albums
  return results;
}

async function loadUserCollectionFromDiscogs(oauth, username) {
  // load Discogs user and collection
  const [ user, collection ] = await Promise.all([
    discogs.loadUser(oauth, username),
    discogs.loadCollection(oauth, username)
  ]);

  // store in database
  await db.putUserCollection(username, user, collection);
  console.log('New collection loaded successfuly:', username);
}

export function getDiscogsCollectionAlbum(username, albumIds) {
  return db.getCollectionAlbums(username, albumIds);
}

/*
 * Discogs Releases
 */

export function getDiscogsRelease(releaseIds) {
  return db.getReleases(releaseIds, id => loadReleaseFromDiscogs(id));
}

async function loadReleaseFromDiscogs(releaseId) {
  try {
    // load release
    const release = await discogs.loadRelease(releaseId);
    // store in database
    await db.putRelease(releaseId, release);
    console.log('New release loaded successfuly:', releaseId);
    // return release object
    return release;

  } catch(err) {
    console.error(err);
    // if release cannot be loaded, return null
    // other releases might of succeded so we shouldn't break the whole request
    return null;
  }
}
