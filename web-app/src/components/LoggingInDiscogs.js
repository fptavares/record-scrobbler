import React from 'react';
import queryString from 'query-string';
import environment from '../createRelayEnvironment';
import Loading from './Loading';
import AuthenticateDiscogs from '../mutations/AuthenticateDiscogs';


class LoggingInDiscogs extends React.Component {
  componentDidMount() {
    if (window.location.search) {
      const { oauth_verifier } = queryString.parse(window.location.search);
      if (oauth_verifier) {
        AuthenticateDiscogs.commit(
          environment,
          oauth_verifier
        );
      }
    }
  }

  render() {
    return (
      <Loading text="Logging in..." />
    );
  }
}

export default LoggingInDiscogs;
