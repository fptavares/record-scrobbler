import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation RemoveFromPlaylistMutation($input: RemoveFromPlaylistInput!) {
    removeFromPlaylist(input:$input) {
      album {
        id
        inPlaylist
      }
      viewer {
        id
        playlist {
          id
          numItems
        }
      }
    }
  }
`;

function getOptimisticResponse(album, viewer) {
  if (!viewer || !viewer.playlist) {
    return null;
  }
  const { playlist } = viewer;
  return {
    removeFromPlaylist: {
      album: {
        id: album.id,
        inPlaylist: null,
      },
      viewer: {
        id: viewer.id,
        playlist: {
          id: playlist.id,
          numItems: playlist.numItems-1,
        },
      }
    },
  };
}

function commit(environment, album, playlist) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          albumId: album.id,
        },
      },
      optimisticResponse: getOptimisticResponse(album, playlist),
    }
  );
}

export default {commit};
