import DataLoader from 'dataloader';

import {
  getDiscogsCollection,
  getDiscogsCollectionAlbum,
  getDiscogsUser,
  getDiscogsRelease,
} from './discogs-client';

import {
  getLastfmUser,
} from './lastfm-client';

import { getPlaylist } from './playlist-client';


function createLoader(fetcher) {
  return new DataLoader(
    keys => Promise.all(keys.map(fetcher))
  );
}

function createAlbumLoader(token, username) {
  return new DataLoader(ids => getDiscogsCollectionAlbum(token, username, ids));
}

function createReleaseLoader(token) {
  return new DataLoader(ids => getDiscogsRelease(token, ids));
}

function createNullLoader() {
  return createLoader(() => null);
}

export function createLoaders(user) {
  if (user && user.username && user.discogsToken) {
    return {
      album: createAlbumLoader(user.discogsToken, user.username),
      release: createReleaseLoader(user.discogsToken),
      playlist: createLoader((username) => getPlaylist(username)),
      collection: createLoader(({username, after, size, search}) =>
        getDiscogsCollection(user.discogsToken, username, after, size, null, search)),
      user: createLoader((username) => getDiscogsUser(user.discogsToken, username)),
      lastfmUser: createLoader((username) => getLastfmUser(user.lastfmToken, username)),
    }
  } else {
    const nullLoader = createNullLoader();
    return {
      album: nullLoader,
      playlist: nullLoader,
      collection: nullLoader,
      user: nullLoader,
      lastfmUser: nullLoader,
    }
  }
}
