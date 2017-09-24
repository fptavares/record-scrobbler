import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import { nodeInterface } from '../relayNode';


const GraphQLSubTrack = new GraphQLObjectType({
  name: 'SubTrack',
  fields: {
    position: { type: GraphQLString },
    title: { type: GraphQLString },
    duration: { type: GraphQLString },
    type: {
      type: GraphQLString,
      resolve: obj => obj.type_
    },
  },
});
const GraphQLTrack = new GraphQLObjectType({
  name: 'Track',
  fields: {
    ...GraphQLSubTrack.fields,
    subTracks: {
      type: new GraphQLList(GraphQLSubTrack),
      resolve: obj => obj.sub_tracks
    },
  },
});

const GraphQLAlbum = new GraphQLObjectType({
  name: 'Album',
  fields: {
    id: globalIdField('Album'),
    releaseId: { type: GraphQLInt },
    title: { type: GraphQLString },
    artist: { type: GraphQLString },
    year: { type: GraphQLInt },
    thumb: { type: GraphQLString },
    //labels: [String],
    rating: { type: GraphQLInt },
    notes: { type: GraphQLString },
    dateAdded: { type: GraphQLString },
    folderId: { type: GraphQLInt },
    inPlaylist: {
      type: GraphQLInt,
      resolve: async(obj, args, {user, loaders}) => {
        if (obj.inPlaylist !== undefined) {
          return obj.inPlaylist;
        }
        const {id} = obj;
        const playlist = await loaders.playlist.load(user.username);
        if (playlist && playlist.has(id)) {
          return playlist.get(id);
        }
        return null;
      },
    },
    tracks: {
      type: new GraphQLList(GraphQLTrack),
      resolve: async({releaseId}, args, {loaders}) => {
        if (!releaseId) {
          return null;
        }
        const release = await loaders.release.load(releaseId);
        return release.tracks;
      },
    },
  },
  interfaces: [nodeInterface],
});


export { GraphQLAlbum };
