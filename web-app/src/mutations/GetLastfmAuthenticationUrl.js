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
        console.log('GetLastfmAuthenticationUrlMutation', response);
        window.location.assign(response.getLastfmAuthenticationUrl.authenticationUrl);
      },
      onError: err => console.error(err),
    }
  );
}

export default {commit};
