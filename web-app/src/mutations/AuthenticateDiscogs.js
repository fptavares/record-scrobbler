import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation AuthenticateDiscogsMutation($input: AuthenticateDiscogsInput!) {
    authenticateDiscogs(input:$input) {
      token
    }
  }
`;

function commit(environment, oauthVerifier) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          oauthVerifier,
        },
      },
      onCompleted: (response) => {
        localStorage.token = response.authenticateDiscogs.token;
        window.location = '/';
      },
    }
  );
}

export default {commit};
