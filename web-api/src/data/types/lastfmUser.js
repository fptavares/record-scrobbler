import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../relayNode';

const GraphQLLastfmUser = new GraphQLObjectType({
  name: 'LastfmUser',
  fields: {
    id: globalIdField('LastfmUser', obj => obj.username),
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    avatarURL: { type: GraphQLString },
    lastScrobble: { type: GraphQLString },
  },
  interfaces: [nodeInterface],
});

function resolveLastfmUser(obj, args, {loaders}) {
  if (!obj || !obj.lastfmUsername) {
    return null;
  }
  return loaders.lastfmUser.load(obj.lastfmUsername);
}

export { GraphQLLastfmUser, resolveLastfmUser };
