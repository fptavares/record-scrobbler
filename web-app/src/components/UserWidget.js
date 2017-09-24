import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import environment from '../createRelayEnvironment';
import GetLastfmAuthenticationUrl from '../mutations/GetLastfmAuthenticationUrl';
import './UserWidget.css';
import lastfm from './images/lastfm_red_small.gif';
import lastfmIcon from './images/lastfm.svg';
import discogsIcon from './images/discogs_vinyl_record_mark.svg';

class UserWidget extends React.Component {
  _handleLastfmLoginClick(e) {
    e.preventDefault();
    GetLastfmAuthenticationUrl.commit(
      environment,
      window.location.protocol+'//'+window.location.host+'/loginLastfm'
    );
  }

  renderDiscogsUser(username, numCollection) {
    return (
      <div className="user">
        <img className="avatar" src={discogsIcon} alt="" />
        <label>{username}</label>
        <label> (<strong>{numCollection}</strong> albums)</label>
      </div>
    );
  }

  renderLastfmUser(username) {
    return (
      <div className="user">
        <img className="avatar" src={lastfmIcon} alt="" />
        <label>{username}</label>
      </div>
    );
  }

  renderLastfmLogin() {
    return (
      <div className="user">
        Login to&nbsp;
        <button className="lastfm-button" onClick={this._handleLastfmLoginClick}>
          <img className="lastfm-logo" src={lastfm} alt="Last.fm" />
        </button>
      </div>
    );
  }

  render() {
    const {
      username,
      lastfmUsername,
      discogsUser: { numCollection }
    } = this.props.viewer;
    
    return (
      <div className="user-session">
      { username && this.renderDiscogsUser(username, numCollection) }
      { (lastfmUsername && this.renderLastfmUser(lastfmUsername))
        || this.renderLastfmLogin() }
      </div>
    );
  }
}

export default createFragmentContainer(UserWidget, {
  viewer: graphql`
    fragment UserWidget_viewer on Viewer {
      id
      username
      lastfmUsername
      discogsUser {
        numCollection
      }
    }
  `,
});
