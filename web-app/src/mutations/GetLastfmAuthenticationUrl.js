import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation GetLastfmAuthenticationUrlMutation($input: GetLastfmAuthenticationUrlInput!) {
    getLastfmAuthenticationUrl(input:$input) {
      authenticationUrl
    }
  }
`;

function commit(environment, callbackUrl) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          callbackUrl,
        },
      },
      onCompleted: (response) => {
        const { authenticationUrl } = response.getLastfmAuthenticationUrl;
        if (authenticationUrl) {
          window.location.assign(authenticationUrl);
        }
      },
      onError: err => console.error(err),
    }
  );
}

export default {commit};
