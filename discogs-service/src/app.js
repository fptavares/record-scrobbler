import express from 'express';
import morgan from 'morgan';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import config from './config';
import {
  getDiscogsCollection,
  getDiscogsCollectionAlbum,
  getDiscogsRelease,
  getDiscogsUser,
  getOauthRequestToken,
  authenticate
} from './service-controller';


async function handleGetCollection(req, res) {
  // process input
  const { username } = req.params;
  const { q, folder, after, size } = req.query;
  const oauth = req.user.token;
  // get collection
  const {
    albums,
    endCursor,
    moreAlbums
  } = await getDiscogsCollection(oauth, username, folder, q, after, size);
  console.log('Responding with %d albums.', albums.length);
  // respond to request
  res.json({
    albums,
    endCursor,
    moreAlbums
  });
}

async function handleGetCollectionAlbum(req, res) {
  // process input
  const { username } = req.params;
  const albumIds = req.params.albumIds.split(',').map(id => parseInt(id));
  // get albums
  const albums = await getDiscogsCollectionAlbum(username, albumIds)
  console.log('Responding with %d albums out of %d requested.',
    albums.length,
    albumIds.length
  );
  // respond to request
  res.json(albums);
}

async function handleGetUser(req, res) {
  // process input
  const { username } = req.params;
  const oauth = req.user.token;
  // get user
  const user = await getDiscogsUser(oauth, username);
  // respond to request
  res.json(user);
}

async function handleGetRelease(req, res) {
  // process input
  const releaseIds = req.params.releaseIds.split(',').map(id => parseInt(id));
  // get releases
  const releases = await getDiscogsRelease(releaseIds);
  console.log('Responding with %d releases out of %d requested.',
    releases.length,
    releaseIds.length
  );
  // respond to request
  res.json(releases);
}

async function handleGetOauthRequestToken(req, res) {
  // process input
  const { cb } = req.query;
  // get request token
  const requestToken = await getOauthRequestToken(cb);
  // respond to request
  res.json(requestToken);
}

async function handleAuthenticate(req, res) {
  // process input
  const { discogsRequestToken, discogsOauthVerifier } = req.body;
  // authenticate
  const userData = await authenticate(discogsRequestToken, discogsOauthVerifier);
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
  res.json({
    username: userData.username,
    discogsToken
  });
}

function handleError(err, res) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message: 'Invalid token'});
  } else {
    console.error(err);
    res.status(500).json({message: err.message})
  }
}

// wrapper that catches all errors and sends them as 500 response using express
function asyncRequest(asyncFn, req, res) {
  asyncFn(req, res).catch(err => handleError(err, res));
}
function safe(asyncFn) {
  return asyncRequest.bind(null, asyncFn);
}

// create express app
const app = express();
// instantiate middlewares
app.use(morgan('tiny'));
app.use(jwt({ secret: config.JWT_SECRET }).unless({
  path: ['/oauth/requestToken', '/oauth/authenticate']
}));
// define routes
app.get('/collection/:username', safe(handleGetCollection));
app.get('/collection/:username/album/:albumIds', safe(handleGetCollectionAlbum));
app.get('/user/:username', safe(handleGetUser));
app.get('/release/:releaseIds', safe(handleGetRelease));
app.get('/oauth/requestToken', safe(handleGetOauthRequestToken));
app.post('/oauth/authenticate', safe(handleAuthenticate));
// error handling
app.use((err, req, res, next) => handleError(err, res)); // eslint-disable-line no-unused-vars

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

export default app;
