import { GraphQLInt, GraphQLList } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLAlbum } from '../types/album';
import { GraphQLPlaylist, populatePlaylist } from '../types/playlist';
import { scrobble } from '../lastfm-client';
import { clearPlaylist } from '../playlist-client';


const GraphQLScrobbleMutation = mutationWithClientMutationId({
  name: 'Scrobble',
  outputFields: {
    accepted: { type: GraphQLInt },
    ignored: { type: GraphQLInt },
    playlist: { type: GraphQLPlaylist },
    scrobbledAlbums: { type: new GraphQLList(GraphQLAlbum) }
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
    let scrobbledAlbums = null;
    if (ignored === 0) { // everything successfuly scrobbled
      const isCleared = await clearPlaylist(username); // so clear playlist
      if (isCleared) {
        // and update the client
        playlist = populatePlaylist(username, new Map([]));
        scrobbledAlbums = albums.map(album => {
          album.inPlaylist = null;
          return album;
        });
      }
    }

    return {
      accepted,
      ignored,
      playlist,
      scrobbledAlbums
    }
  },
});

export { GraphQLScrobbleMutation };
