import jsonwebtoken from 'jsonwebtoken';
import discogs from './discogs-client';
import db from './datastore-client';
import config from './config';

/*
 * Authentication
 */

function getOauthRequestToken({query: {cb}}) {
  // get request token
  return discogs.loadRequestToken(cb);
}

function authenticate({body: {discogsRequestToken, oauthVerifier}}) {
  // Authenticate by consumer key and secret
  const userData = discogs.authenticate(discogsRequestToken, oauthVerifier);
  // sign discogs token as JWT
  const discogsToken = jsonwebtoken.sign(
    {
      username: userData.username,
      token: userData.token
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES }
  );
  // respond to request
  return {
    username: userData.username,
    discogsToken
  };
}

/*
 * Discogs User
 */

function getDiscogsUser(username) {
  return db.getUser(username);
}

/*
 * Discogs User Collection
 */

async function getDiscogsCollection(username, {user, query}) {
  // process input
  const { q: search, folder, after, size=30 } = query;
  const { token } = user;

  // execute query
  const results = await db.queryCollection(
    username,
    parseInt(folder),
    search,
    after,
    parseInt(size)
  );

  // load collection if it's an unfiltered first request
  if ((!results.albums || results.albums.length === 0) && !after && !search && !folder) {
    // load Discogs user and collection
    await loadUserCollectionFromDiscogs(token, username);
    // re-execute query
    return db.queryCollection(
      username,
      parseInt(folder),
      search,
      after,
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

function getDiscogsCollectionAlbum(username, albumIdsCSV) {
  // process input
  const albumIds = albumIdsCSV.split(',').map(id => parseInt(id));
  // get albums
  return db.getCollectionAlbums(username, albumIds);
}

/*
 * Discogs Releases
 */

function getDiscogsRelease(releaseIdsCSV) {
  // process input
  const releaseIds = releaseIdsCSV.split(',').map(id => parseInt(id));
  // get releases
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

export {
  getOauthRequestToken,
  authenticate,
  getDiscogsUser,
  getDiscogsCollection,
  getDiscogsCollectionAlbum,
  getDiscogsRelease
};
