import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import {
  GraphQLViewer,
  resolveViewer
} from './types/viewer';

import {
  GraphQLDiscogsRequestTokenMutation,
  GraphQLAuthenticateDiscogsMutation
} from './mutations/discogs';
import {
  GraphQLGetLastfmAuthenticationUrlMutation,
  GraphQLAuthenticateLastfmMutation
} from './mutations/lastfm';
import {
  GraphQLAddToPlaylistMutation,
  GraphQLRemoveFromPlaylistMutation
} from './mutations/playlist';
import {
  GraphQLScrobbleMutation,
} from './mutations/scrobble';

import { nodeField } from './relayNode';


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLViewer,
      resolve: resolveViewer,
    },
    node: nodeField,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    getDiscogsRequestToken: GraphQLDiscogsRequestTokenMutation,
    authenticateDiscogs: GraphQLAuthenticateDiscogsMutation,
    getLastfmAuthenticationUrl: GraphQLGetLastfmAuthenticationUrlMutation,
    authenticateLastfm: GraphQLAuthenticateLastfmMutation,
    addToPlaylist: GraphQLAddToPlaylistMutation,
    removeFromPlaylist: GraphQLRemoveFromPlaylistMutation,
    scrobble: GraphQLScrobbleMutation,
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
