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
    this._removeSuccessMessage = this._removeSuccessMessage.bind(this);
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
    // TODO
  }

  _removeSuccessMessage() {
    this.setState({ scrobbleResult: null });
  }
  _onScrobbleSuccess(accepted, ignored) {
    setTimeout(this._removeSuccessMessage, 5000);
    this.setState({
      scrobbleResult: {
        accepted,
        ignored
      }
    });
  }

  renderScrobbleResult() {
    const { accepted, ignored } = this.state.scrobbleResult;
    return (
      <div style={{ color: '#beb'}}>
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
