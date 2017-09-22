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
  const { q, folder, from, size } = req.query;
  const oauth = req.user;
  // get collection
  const { total, albums } = await getDiscogsCollection(oauth, username, folder, q, from, size)
  console.log('Responding with %d albums out of %d.', albums.length, total);
  // respond to request
  res.json({ total, albums });
}

async function handleGetCollectionAlbum(req, res) {
  // process input
  const albumIds = req.params.albumIds.split(',').map(id => parseInt(id));
  // get albums
  const albums = await getDiscogsCollectionAlbum(albumIds)
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
  const oauth = req.user;
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
  res.send(requestToken);
}

async function handleAuthenticate(req, res) {
  // process input
  const { discogsRequestToken, discogsOauthVerifier } = req.body;
  // authenticate
  const userData = await authenticate(discogsRequestToken, discogsOauthVerifier);
  // sign discogs token as JWT
  const discogsToken = jsonwebtoken.sign(
    userData.token,
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES }
  );
  // respond to request
  res.json({
    username: userData.username,
    discogsToken
  });
}

// create express app
const app = express();
// instantiate middlewares
app.use(morgan('tiny'));
app.use(jwt({ secret: config.JWT_SECRET }).unless({
  path: ['/oauth/requestToken', '/oauth/authenticate']
}));
// define routes
app.get('/collection/:username', handleGetCollection);
app.get('/collection/:username/album/:albumIds', handleGetCollectionAlbum);
app.get('/user/:username', handleGetUser);
app.get('/release/:releaseIds', handleGetRelease);
app.get('/oauth/requestToken', handleGetOauthRequestToken);
app.post('/oauth/authenticate', handleAuthenticate);
// error handling
app.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message: 'Invalid token'});
  } else {
    console.error(err);
    res.status(500).json({message: err.message})
  }
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

export default app;
