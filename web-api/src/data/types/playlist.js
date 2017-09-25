import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import { GraphQLAlbum } from './album';
import { nodeInterface } from '../relayNode';


const GraphQLPlaylist = new GraphQLObjectType({
  name: 'Playlist',
  fields: {
    id: globalIdField('Playlist'),
    numItems: { type: GraphQLInt },
    items: {
      type: new GraphQLList(GraphQLAlbum),
      resolve: async({items}, args, {loaders}) => {
        // load playlist albums
        const albums = await loaders.album.loadMany(Array.from(items.keys()));
        // return albums with inPlaylist counter
        return albums.map(album => {
          if (!album) {
            return null;
          }
          album.inPlaylist = items.get(album.id);
          return album;
        });
      },
    },
  },
  interfaces: [nodeInterface],
});

function populatePlaylist(username, items) {
  return {
    id: username,
    items: items,
    numItems: items.size,
  }
}

async function resolvePlaylist({username}, args, {loaders}) {
  const items = await loaders.playlist.load(username);
  if (!items) {
    return null;
  }
  return populatePlaylist(username, items);
}

export { GraphQLPlaylist, populatePlaylist, resolvePlaylist };
