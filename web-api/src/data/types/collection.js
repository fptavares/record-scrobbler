import {
  GraphQLInt,
} from 'graphql';
import {
  connectionDefinitions,
  connectionFromArraySlice,
  getOffsetWithDefault,
} from 'graphql-relay';

import { GraphQLAlbum } from './album';


const {
  connectionType: UserCollectionConnection,
  edgeType: UserCollectionEdge,
} = connectionDefinitions({
  name: 'Album',
  nodeType: GraphQLAlbum,
});

async function resolveCollection(obj, args, {loaders}) {
  if (!obj || !obj.username) {
    return null;
  }
  const { username } = obj;
  const { after, first, search=null } = args;
  // we know we will need to resolve the album inPlaylist field
  // so we preload the playlist for better performance
  loaders.playlist.load(username);
  // load collection albums
  const {
    albums=[],
    endCursor=null,
    moreAlbums=false
  } = await loaders.collection.load({
    username,
    after,
    size: first,
    search,
  });
  // create edge for each album
  const edges = albums.map((album, index) => {
    // no cursor available per item from gcloud datastore,
    // but it's mandatory according to relay spec...
    // so setting a fake unique cursor on edges other than the last
    return {
      cursor: (index === albums.length-1) ? endCursor : album.id,
      node: album,
    }
  });
  // return connection (https://facebook.github.io/relay/graphql/connections.htm)
  return {
    edges,
    pageInfo: {
      endCursor,
      hasNextPage: moreAlbums,
      startCursor: null,
      hasPreviousPage: false // cannot be null, but according to spec we may return false when paginating forward
    },
  };
}

export { UserCollectionConnection, UserCollectionEdge, resolveCollection };
