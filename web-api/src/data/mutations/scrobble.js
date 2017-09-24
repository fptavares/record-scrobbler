import { GraphQLInt } from 'graphql';

import {
  mutationWithClientMutationId,
} from 'graphql-relay';

import { GraphQLPlaylist } from '../types/playlist';
import { scrobble } from '../lastfm-client';
import {
  clearPlaylist,
  populatePlaylist
} from '../playlist-client';


const GraphQLScrobbleMutation = mutationWithClientMutationId({
  name: 'Scrobble',
  outputFields: {
    accepted: { type: GraphQLInt },
    ignored: { type: GraphQLInt },
    playlist: { type: GraphQLPlaylist },
  },
  mutateAndGetPayload: async(args, {user, loaders}) => {
    if (!user || !user.username) {
      throw Error('Must authenticate Discogs first!');
    }

    const { username, lastfmToken, lastfmUsername } = user;
    if (!lastfmToken || !lastfmUsername) {
      throw Error('Must authenticate Last.fm first!');
    }

    // get playlist
    const items = await loaders.playlist.load(username);
    if (!items || items.length === 0) {
      throw Error('Playlist is empty!');
    }

    let albumIds = [];
    items.forEach(
      (count, id) => Array.prototype.push.apply(albumIds, Array(count).fill(id))
    );

    // get playlist albums
    const albums = await loaders.album.loadMany(albumIds);

    // get releases
    const releases = await loaders.release.loadMany(
      albums.filter(album => album.releaseId).map(album => album.releaseId)
    );

    // scrobble
    const { accepted, ignored } = await scrobble(lastfmToken, lastfmUsername, releases);

    let playlist = null;
    if (ignored === 0) { // everything successfuly scrobbled
      const isCleared = await clearPlaylist(username); // so clear playlist
      if (isCleared) {
        playlist = populatePlaylist(username, new Map([])); // and update the client
      }
    }

    return {
      accepted,
      ignored,
      playlist,
    }
  },
});

export { GraphQLScrobbleMutation };
