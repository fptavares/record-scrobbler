import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import Album from './Album';
import ErrorPage from './ErrorPage';


class Playlist extends React.Component {
  renderAlbums() {
    return this.props.viewer.playlist.items.map(album =>
      <Album
        key={album.id}
        album={album}
        viewer={this.props.viewer}
      />
    );
  }

  render() {
    if (!this.props.viewer.playlist) {
      return <ErrorPage error={{code: 'RequiresPlaylist'}} />;
    }

    const { items } = this.props.viewer.playlist;
    return (
      <div className="sleeves">
        {
          (items && items.length > 0 && this.renderAlbums())
            || <p>Your playlist is empty!</p>
        }
      </div>
    );
  }
}

export default createFragmentContainer(Playlist,
  {
  viewer: graphql`
    fragment Playlist_viewer on Viewer {
      playlist {
        id
        numItems
        items {
          id
          inPlaylist
          ...Album_album
        }
      }
      id
      ...Album_viewer
    }`
  },
);
