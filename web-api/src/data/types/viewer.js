import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  forwardConnectionArgs,
  globalIdField,
} from 'graphql-relay';

import {
  UserCollectionConnection,
  resolveCollection
} from './collection';
import {
  GraphQLDiscogsUser,
  resolveDiscogsUser
} from './discogsUser';
import {
  GraphQLLastfmUser,
  resolveLastfmUser
} from './lastfmUser';
import {
  GraphQLPlaylist,
  resolvePlaylist
} from './playlist';


const GraphQLViewer = new GraphQLObjectType({
  name: 'Viewer',
  fields: {
    id: globalIdField('Viewer', obj => obj.username),
    username: { type: GraphQLString },
    lastfmUsername: { type: GraphQLString },
    discogsUser: {
      type: GraphQLDiscogsUser,
      resolve: resolveDiscogsUser,
    },
    lastfmUser: {
      type: GraphQLLastfmUser,
      resolve: resolveLastfmUser,
    },
    collection: {
      type: UserCollectionConnection,
      args: {
        search: { type: GraphQLString },
        ...forwardConnectionArgs, // we only support forward pagination
      },
      resolve: resolveCollection,
    },
    playlist: {
      type: GraphQLPlaylist,
      resolve: resolvePlaylist,
    },
  },
});

function resolveViewer(root, args, {user}) {
  if (!user || !user.username) {
    return null;
  }
  return user;
}

export { GraphQLViewer, resolveViewer };
