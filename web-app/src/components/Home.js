import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { QueryRenderer, graphql } from 'react-relay';
import environment from '../createRelayEnvironment';
import Collection from './Collection';
import Loading from './Loading';
import Login from './Login';
import ErrorPage from './ErrorPage';

const homeCollectionQuery = graphql`
  query HomeQuery(
    $count: Int
    $cursor: String
    $search: String
  ) {
    viewer {
      id
      ...Collection_viewer
    }
  }
`;

class Home extends Component {
  renderHome({error, props}) {
    return (
      (props && props.viewer &&
        <Collection viewer={props.viewer} />)
      || (((props && !props.viewer) || (error && error.code === 401)) &&
        <Login />)
      || (error &&
        <ErrorPage error={error} />)
      || (!props &&
        <Loading />)
    );
  }

  render() {
    const { searchQuery } = this.props.match.params;
    return (
      <QueryRenderer
        environment={environment}
        query={homeCollectionQuery}
        variables={{count: 48, search: searchQuery ? searchQuery : null}}
        render={this.renderHome}
      />
    );
  }
}

export default withRouter(Home)
