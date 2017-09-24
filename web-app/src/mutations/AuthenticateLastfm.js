import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation AuthenticateLastfmMutation($input: AuthenticateLastfmInput!) {
    authenticateLastfm(input:$input) {
      token
    }
  }
`;

function commit(environment, oauthToken, errorCallback) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          oauthToken,
        },
      },
      onCompleted: (response) => {
        if (response && response.authenticateLastfm) {
          localStorage.token = response.authenticateLastfm.token;
          window.location = '/';
        }
      },
      onError: errorCallback,
    }
  );
}

export default {commit};
