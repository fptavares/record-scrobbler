import {
  fromGlobalId,
  nodeDefinitions,
} from 'graphql-relay';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId, {loaders}) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Album') {
      return loaders.album.load(id);
    } else if (type === 'DiscogsUser') {
      return loaders.user.load(id);
    } else if (type === 'Playlist') {
      return loaders.playlist.load(id);
    } else if (type === 'LastfmUser') {
      return loaders.lastfmUser.load(id);
    }
    return null;
  },
  (obj) => {
    if (obj.hasOwnProperty('releaseId')) {
      return 'Album';
    } else if (obj.hasOwnProperty('numCollection')) {
      return 'DiscogsUser';
    } else if (obj.hasOwnProperty('numItems')) {
      return 'Playlist';
    } else if (obj.hasOwnProperty('lastScrobble')) {
      return 'LastfmUser';
    }
    return null;
  }
);

export {nodeInterface, nodeField};
