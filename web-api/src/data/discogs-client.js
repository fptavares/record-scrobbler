import axios from 'axios';
import config from '../config';

const client = axios.create({
  baseURL: config.DISCOGS_BASEURL,
  timeout: 30000
});

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function getDiscogsRequestToken(callbackUrl) {
  const { data } = await client.get('/oauth/requestToken', {
    params: { cb: callbackUrl },
  });

  return {
    discogsRequestToken: data,
    discogsAuthorizeUrl: data.authorizeUrl,
  };
}

export function authenticateDiscogs(discogsRequestToken, discogsOauthVerifier) {
  return client.post('/oauth/authenticate', {
    discogsRequestToken,
    discogsOauthVerifier, // Verification code sent back by Discogs
  }).then(resp => resp.data);
}

export function getDiscogsUser(token, username) {
  return client.get(`/user/${username}`, {
    headers: authHeader(token),
  }).then(resp => resp.data);
}

export function getDiscogsCollection(token, username, after, size, folder, search) {
  return client.get(`/collection/${username}`, {
    headers: authHeader(token),
    params: { folder, q: search, after, size },
  }).then(resp => resp.data);

}

export function getDiscogsCollectionAlbum(token, username, albumIds) {
  const formattedAlbumIds = albumIds.join(',');
  return client.get(`/collection/${username}/album/${formattedAlbumIds}`, {
    headers: authHeader(token),
  }).then(resp => resp.data);
}

export function getDiscogsRelease(token, releaseIds) {
  const formattedReleaseIds = releaseIds.join(',');
  return client.get(`/release/${formattedReleaseIds}`, {
    headers: authHeader(token),
  }).then(resp => resp.data);
}
