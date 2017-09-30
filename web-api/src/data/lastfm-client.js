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
  return client.get('/authenticationUrl', {
    params: { cb: callbackUrl },
  }).then(resp => resp.data);
}

export function authenticateLastfm(loginToken) {
  return client.post('/authenticate', {
    token: loginToken
  }).then(resp => resp.data);
}

export function getLastfmUser(token, username) {
  return client.get(`/user/${username}`, {
    headers: authHeader(token),
  }).then(resp => resp.data);
}

function generateTrackObject(track, release, previousTime) {
  const [ minutes, seconds ] = track.duration ? track.duration.split(':') : [1, 0];
  const time = previousTime - parseInt(minutes) * 60 + parseInt(seconds);
  const artist = track.artist ? track.artist : release.artist;
  return {
    artist: artist,
    track: track.title,
    album: release.title,
    timestamp: time
  };
}

function addReleaseTracksToArray(previousArray, tracks, release) {
  return tracks.reduceRight((accumulator, track) => {
    if (track.sub_tracks && track.sub_tracks.length > 0) {
      return addReleaseTracksToArray(accumulator, track.sub_tracks, release)
    }
    const time = accumulator.length > 0 ?
      accumulator[accumulator.length-1].timestamp : Math.floor(Date.now() / 1000);
    const nextTrack = generateTrackObject(track, release, time)
    return accumulator.concat(nextTrack);
  }, previousArray);
}

export function scrobble(token, username, releases) {
  const tracks = releases.reduce(
    (list, release) => addReleaseTracksToArray(list, release.tracks, release),
    []
  );
  return client.post(`/scrobble/${username}`, tracks, {
    headers: authHeader(token),
  }).then(resp => resp.data);
}
