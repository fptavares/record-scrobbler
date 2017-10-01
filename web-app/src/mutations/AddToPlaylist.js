import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation AddToPlaylistMutation($input: AddToPlaylistInput!) {
    addToPlaylist(input:$input) {
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
    addToPlaylist: {
      album: {
        id: album.id,
        inPlaylist: album.inPlaylist ? album.inPlaylist+1 : 1,
      },
      viewer :{
        id: viewer.id,
        playlist: {
          id: playlist.id,
          numItems: album.inPlaylist ? playlist.numItems : playlist.numItems+1,
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
