import React, { Component } from 'react';
import { graphql } from 'react-relay';
//import ScrobbleList from './ScrobbleList'
import QueryContainer from './QueryContainer'

const scrobbleQuery = graphql`
  query ScrobbleContainerQuery {
    viewer {
      id
      ...Playlist_viewer
    }
  }
`;

class ScrobbleContainer extends Component {
  render() {
    return (
      <QueryContainer
        component={null}
        query={scrobbleQuery}
        back={true}
      />
    );
  }
}

export default ScrobbleContainer;
