import React from 'react';
import './Loading.css';
import loading from './images/loading.svg';

class Loading extends React.Component {
  render() {
    return (
      <div id="loader" className="overlay-loader">
      	<img className="loader-icon spinning-cog"
          src={loading}
          alt="Loading..."
          data-cog="cog01" />
        { this.props.text && <p>{this.props.text}</p> }
      </div>
    );
  }
}

export default Loading;
