import React from 'react';
import queryString from 'query-string';
import environment from '../createRelayEnvironment';
import ErrorPage from './ErrorPage';
import Loading from './Loading';
import AuthenticateLastfm from '../mutations/AuthenticateLastfm';


class LoggingInLastfm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (window.location.search) {
      const { token } = queryString.parse(window.location.search);
      if (token) {
        AuthenticateLastfm.commit(
          environment,
          token,
          (error) => {
            console.log('onError:', error);
            this.setState({ error })
          },
        );
      }
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorPage error={this.state.error} />;
    }
    return (
      <Loading />
    );
  }
}

export default LoggingInLastfm;
