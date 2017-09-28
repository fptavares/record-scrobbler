import LastfmAPI from 'lastfmapi';
import jsonwebtoken from 'jsonwebtoken';
import chunk from 'lodash.chunk';
import config from './config';

const LAST_FM_API_KEY = {
  'api_key' : config.LASTFM_API_KEY,
  'secret' : config.LASTFM_SECRET
};

export function getAuthenticationUrl(req, res) {
  const { cb } = req.query;

  const lfm = new LastfmAPI(LAST_FM_API_KEY);
  // get authentication URL from Last.fm
  const authenticationUrl = lfm.getAuthenticationUrl({ cb });

  res.json({ authenticationUrl }); // redirect the user to this URL
}

export function authenticate(req, res) {
  const { token } = req.query;

  const lfm = new LastfmAPI(LAST_FM_API_KEY);
  lfm.authenticate(token, (err, session) => {
    if (err) {
      return sendError(res, 500, 'AuthenticationFailed', err);
    }

    // sign Last.fm token as JWT
    const lastfmToken = jsonwebtoken.sign(
      session.key,
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES }
    );

    // respond to request
    res.json({
      username: session.username,
      lastfmToken
    });
  });
}

export function getUser(req, res) {
  const [ username ] = req.params;
  if (!username) {
    return sendError(res, 400, 'MissingUsername', 'Request did not provide username');
  }

  const lfm = new LastfmAPI(LAST_FM_API_KEY);
  lfm.setSessionCredentials(username, req.user.token);
  // get user info from Last.fm
  lfm.user.getInfo(username, (err, info) => {
    if (err) {
      return sendError(res, 500, 'UserFailed', err);
    }

    // respond to request
    res.json({
      username,
      name: info.realname,
      avatarURL: info.image[0]['#text'],
    });
  });
}

export function scrobble(req, res) {
  const [ username ] = req.params;
  if (!username) {
    return sendError(res, 400, 'MissingUsername', 'Request did not provide username');
  }
  const tracks = req.body;
  if (!tracks || tracks.length === 0) {
    return sendError(res, 400, 'MissingTracks', 'What did you want to scrobble again?');
  }

  scrobbleToLastfm(req.user.token, username, tracks)
    .then(scrobbles => res.json(
      scrobbles.reduce((previous, current) => ({
        accepted: previous.accepted + (current.accepted | 0),
        ignored: previous.ignored + (current.ignored | 0)
      }), { accepted: 0, ignored: 0})
    ))
    .catch(err => sendError(res, 500, 'ScrobbleFailed', err));
}

function scrobbleToLastfm(token, username, tracks) {
  const lfm = new LastfmAPI(LAST_FM_API_KEY);
  lfm.setSessionCredentials(username, token);

  return Promise.all(chunk(tracks, 50).map(
    (chunkedTracks) => new Promise((resolve, reject) => {
      lfm.track.scrobble(chunkedTracks, (err, res) => {
        if (err) {
          console.error('Scrobble error:', err);
          return reject(err);
        }
        return resolve(res['@attr']);
      });
    })
  ));
}

function sendError(res, httpStatus, code, message) {
  try {
    console.error(message);
    return res.status(httpStatus).send({ code, message });
  } catch(err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
