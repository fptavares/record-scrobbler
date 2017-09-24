import React from 'react';
import { Link } from 'react-router-dom';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../createRelayEnvironment';
import UserWidget from './UserWidget';
import SessionWidget from './SessionWidget';
import logo from './images/logo.svg';
import './Header.css';

const headerQuery = graphql`
  query HeaderQuery {
    viewer {
      id
      username
      discogsUser {
        name
      }
      ...SessionWidget_viewer
      ...UserWidget_viewer
    }
  }
`;

class Header extends React.Component {
  renderHeader({error, props}) {
    return (
      <div className="App-header">
        <Link to="/"><img src={logo} className="App-logo" alt="Home" /></Link>
        {
          (props && props.viewer && props.viewer.discogsUser &&
            <h2>Happy scrobbling {props.viewer.discogsUser.name ? props.viewer.discogsUser.name : props.viewer.username}!</h2>)
          ||
            <h2>.record scrobbler.</h2>
        }
        { props && props.viewer &&
          <div>
            <UserWidget viewer={props.viewer} />
            <SessionWidget viewer={props.viewer} />
          </div>
        }
      </div>
    );
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={headerQuery}
        render={this.renderHeader}
      />
    );
  }
}

export default Header;
