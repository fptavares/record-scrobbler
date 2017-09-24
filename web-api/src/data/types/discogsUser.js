import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { nodeInterface } from '../relayNode';


const GraphQLFolder = new GraphQLObjectType({
  name: 'Folder',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    count: { type: GraphQLInt },
  },
});

const GraphQLDiscogsUser = new GraphQLObjectType({
  name: 'DiscogsUser',
  fields: {
    id: globalIdField('DiscogsUser', obj => obj.username),
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    numCollection: { type: GraphQLInt },
    avatarURL: { type: GraphQLString },
    folders: { type: new GraphQLList(GraphQLFolder) },
  },
  interfaces: [nodeInterface],
});

function resolveDiscogsUser(obj, args, {loaders}) {
  if (!obj || !obj.username) {
    return null;
  }
  return loaders.user.load(obj.username);
}

export { GraphQLDiscogsUser, resolveDiscogsUser };
