import React from 'react';
import environment from '../createRelayEnvironment';
import GetDiscogsRequestToken from '../mutations/GetDiscogsRequestToken';
import './Login.css';
import discogsLogo from './images/discogs_logo_white.svg';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this._handleDiscogsLoginButton = this._handleDiscogsLoginButton.bind(this);
  }

  _handleDiscogsLoginButton = () => {
    delete(localStorage.token);
    GetDiscogsRequestToken.commit(
      environment,
      window.location.protocol+'//'+window.location.host+'/loginDiscogs'
    );
  }
  render() {
    return (
      <div className="loginContainer">
        <h1>Login to continue</h1>
        <p>
          To begin authentication, click on the button below and you will be
          redirected to a Discogs page which will ask you to authenticate
          and allow access to Discogs Record Scrobbler.
        </p>
        <button className="loginButton" onClick={this._handleDiscogsLoginButton}>
          <img src={discogsLogo} alt="Authenticate" />
        </button>
      </div>
    )
  }
}

export default Login;
