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
      playlist {
        id
        numItems
      }
    }
  }
`;

function getOptimisticResponse(album, playlist) {
  if (!playlist) {
    return null;
  }
  return {
    addToPlaylist: {
      album: {
        id: album.id,
        inPlaylist: album.inPlaylist ? album.inPlaylist+1 : 1,
      },
      playlist: {
        id: playlist.id,
        numItems: album.inPlaylist ? playlist.numItems : playlist.numItems+1,
      },
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
