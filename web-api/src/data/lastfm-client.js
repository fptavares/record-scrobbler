import axios from 'axios';
import config from '../config';

const client = axios.create({
  baseURL: config.LASTFM_BASEURL,
  timeout: config.LASTFM_TIMEOUT
});

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function getLastfmAuthenticationUrl(callbackUrl) {
  const requestData = await client.get('/authenticationUrl', {
    params: { cb: callbackUrl },
  });

  return {
    authenticationUrl: requestData.authenticationUrl,
  };
}

export function authenticateLastfm(loginToken) {
  return client.post('/authenticate', {
    params: { token: loginToken },
  });
}

export function getLastfmUser(token, username) {
  return client.get(`/user/${username}`, {
    headers: authHeader(token),
  });
}

export function scrobble(token, username) {
  return client.post(`/scrobble/${username}`, {
    headers: authHeader(token),
  });
}
