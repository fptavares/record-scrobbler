import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-relay';
import QueryContainer from './QueryContainer';
import Collection from './Collection';

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
  render() {
    const { searchQuery } = this.props.match.params;
    return (
      <QueryContainer
        component={Collection}
        query={homeCollectionQuery}
        variables={{count: 48, search: searchQuery ? searchQuery : null}}
      />
    );
  }
}

export default withRouter(Home)
