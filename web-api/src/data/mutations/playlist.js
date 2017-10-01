import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay';

import { GraphQLAlbum } from '../types/album';
import { GraphQLViewer, resolveViewer } from '../types/viewer';

import {
  addToPlaylist,
  removeFromPlaylist,
} from '../playlist-client';


const GraphQLAddToPlaylistMutation = mutationWithClientMutationId({
  name: 'AddToPlaylist',
  inputFields: {
    albumId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    album: {
      type: GraphQLAlbum,
      resolve: ({item}) => ({ id: item.albumId, inPlaylist: item.count }),
    },
    viewer: {
      type: GraphQLViewer,
      resolve: resolveViewer
    }
  },
  mutateAndGetPayload: async({albumId}, {user}) => ({
    item: await addToPlaylist(user.username, fromGlobalId(albumId).id),
    username: user.username,
  }),
});

const GraphQLRemoveFromPlaylistMutation = mutationWithClientMutationId({
  name: 'RemoveFromPlaylist',
  inputFields: {
    albumId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    album: {
      type: GraphQLAlbum,
      resolve: ({item}) => ({ id: item.albumId, inPlaylist: item.count }),
    },
    viewer: {
      type: GraphQLViewer,
      resolve: resolveViewer
    }
  },
  mutateAndGetPayload: async({albumId}, {user}) => ({
    item: await removeFromPlaylist(user.username, fromGlobalId(albumId).id),
    username: user.username,
  }),
});

export {
  GraphQLAddToPlaylistMutation,
  GraphQLRemoveFromPlaylistMutation
}
