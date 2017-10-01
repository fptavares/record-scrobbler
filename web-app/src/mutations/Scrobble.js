import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation ScrobbleMutation($input: ScrobbleInput!) {
    scrobble(input:$input) {
      accepted
      ignored
      playlist {
        id
        numItems
        items {
          id
          inPlaylist
        }
      }
    }
  }
`;

function getOptimisticResponse(playlist) {
  return {
    scrobble: {
      accepted: 0,
      ignored: 0,
      playlist: {
        id: playlist.id,
        numItems: 0,
        items: [],
      },
    },
  };
}

function commit(environment, playlist, successCallback, errorCallback) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {},
      },
      optimisticResponse: getOptimisticResponse(playlist),
      onCompleted: (response) => {
        if (response && response.scrobble) {
          const { accepted, ignored } = response.scrobble;
          successCallback(accepted, ignored);
        } else {
          errorCallback();
        }
      },
      onError: errorCallback,
    }
  );
}

export default {commit};
