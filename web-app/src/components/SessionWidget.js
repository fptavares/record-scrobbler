import React from 'react';
import { Link } from 'react-router-dom';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import config from '../config';
import Scrobble from '../mutations/Scrobble';
import FunctionLink from './FunctionLink';
import './SessionWidget.css';

class SessionWidget extends React.Component {
  constructor(props) {
    super(props);
    this._handleScrobble = this._handleScrobble.bind(this);
    this._onScrobbleSuccess = this._onScrobbleSuccess.bind(this);
    this._onScrobbleError = this._onScrobbleError.bind(this);
    this._removeScrobbleMessage = this._removeScrobbleMessage.bind(this);
    this.state = {};
  }

  _handleLogout() {
    return delete(localStorage.token);
  }
  _handleScrobble() {
    Scrobble.commit(
      this.props.relay.environment,
      this.props.viewer.playlist,
      this._onScrobbleSuccess,
      this._onScrobbleError
    );
  }

  _onScrobbleError() {
    setTimeout(this._removeScrobbleMessage, 10000);
    this.setState({
      scrobbleResult: {
        error: 'Failed to scrobble tracks!'
      }
    });
  }

  _onScrobbleSuccess(accepted, ignored) {
    setTimeout(this._removeScrobbleMessage, 5000);
    this.setState({
      scrobbleResult: {
        accepted,
        ignored
      }
    });
  }

  _removeScrobbleMessage() {
    this.setState({ scrobbleResult: null });
  }

  renderScrobbleResult() {
    // Error
    const { accepted, ignored, error } = this.state.scrobbleResult;
    if (error) {
      return <div style={{ color: '#FF6C46' }}><strong>{error}</strong></div>;
    }
    // Success
    return (
      <div style={{ color: '#beb' }}>
        {accepted > 0 &&
          <span>Scrobbled <strong>{accepted}</strong> tracks.</span>
        }
        {" "}
        {ignored > 0 &&
          <span><b>{ignored}</b> tracks <b>failed</b>!</span>
        }
      </div>
    );
  }

  render() {
    const { playlist, lastfmUsername } = this.props.viewer;
    return (
      <div className="session">
        {
          (this.state.scrobbleResult &&
            this.renderScrobbleResult()
          )
          || (playlist && playlist.numItems &&
            <div>
              <Link to="/playlist">
                Your playlist has <strong>{playlist.numItems}</strong> albums
              </Link>
              { lastfmUsername && <span>
                &nbsp;&ndash;&nbsp;
                <FunctionLink onClick={this._handleScrobble}>
                  <strong>scrobble</strong>
                </FunctionLink>
              </span>}
              .
            </div>
          )
          || <div>Your playlist is <strong>empty</strong>.</div>
        }
        <div className="logout">
          <a href={config.BASEPATH + '/'} onClick={this._handleLogout}>Logout</a>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(SessionWidget, {
  viewer: graphql`
    fragment SessionWidget_viewer on Viewer {
      id
      lastfmUsername
      playlist {
        id
        numItems
      }
    }
  `,
});
