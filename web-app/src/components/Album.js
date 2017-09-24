import React from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import AddToPlaylist from '../mutations/AddToPlaylist';
import RemoveFromPlaylist from '../mutations/RemoveFromPlaylist';
import defaultImage from './images/record.png';
import './Album.css';

class Album extends React.Component {
  constructor(props) {
    super(props);
    this._handleSleeveClick = this._handleSleeveClick.bind(this);
    this._handleSelectedCountClick = this._handleSelectedCountClick.bind(this);
  }

  _handleSelectedCountClick() {
    RemoveFromPlaylist.commit(
      this.props.relay.environment,
      this.props.album,
      this.props.viewer.playlist,
    );
  }
  _handleSleeveClick() {
    AddToPlaylist.commit(
      this.props.relay.environment,
      this.props.album,
      this.props.viewer.playlist,
    );
  }

  renderAlbumThumb(album) {
    return (
      <img className="albumThumb"
        src={album.thumb} alt={album.artist+' - '+album.title}
        title={album.artist+' - '+album.title} />
    );
  }
  renderDefaultThumb(album) {
    return (
      <div>
        <img className="albumThumb"
          src={defaultImage}
          alt="" />
        <label className="artist">{album.artist}</label>
        <label className="albumTitle">{album.title}</label>
      </div>
    );
  }
  renderSelectedCount(selectedCount) {
    return (
      <span className="selectedIcon action" onClick={
        e => {
          e.stopPropagation();
          this._handleSelectedCountClick();
          e.preventDefault()
        } }>
        {selectedCount}
      </span>
    );
  }

  render() {
    return (
      <div className="sleeve action" onClick={this._handleSleeveClick}>
        {(this.props.album.thumb
          && this.renderAlbumThumb(this.props.album))
          || this.renderDefaultThumb(this.props.album)}
        { this.props.album.inPlaylist
          && this.renderSelectedCount(this.props.album.inPlaylist) }
      </div>
    );
  }
}

export default createFragmentContainer(Album, {
  album: graphql`
    fragment Album_album on Album {
      id
      artist
      title
      thumb
      inPlaylist
    }
  `,
  viewer: graphql`
    fragment Album_viewer on Viewer {
      id
      playlist {
        id
        numItems
      }
    }
  `,
});
