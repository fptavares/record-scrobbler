import React, { Component } from 'react';
import { graphql } from 'react-relay';
import QueryContainer from './QueryContainer';
import Playlist from './Playlist';

const myPlaylistQuery = graphql`
  query PlaylistContainerQuery {
    viewer {
      id
      ...Playlist_viewer
    }
  }
`;

class PlaylistContainer extends Component {
  render() {
    return (
      <QueryContainer
        component={Playlist}
        query={myPlaylistQuery}
        back={true}
      />
    );
  }
}

export default PlaylistContainer
