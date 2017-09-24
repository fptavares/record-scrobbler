import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation GetDiscogsRequestTokenMutation($input: DiscogsRequestTokenInput!) {
    getDiscogsRequestToken(input:$input) {
      token
      discogsAuthorizeUrl
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
        console.log(response);
        localStorage.token = response.getDiscogsRequestToken.token;
        window.location.assign(response.getDiscogsRequestToken.discogsAuthorizeUrl);
      },
      onError: err => console.error(err),
    }
  );
}

export default {commit};
