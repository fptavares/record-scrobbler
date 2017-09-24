import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { QueryRenderer } from 'react-relay';
import environment from '../createRelayEnvironment';
import Loading from './Loading';
import Login from './Login';
import ErrorPage from './ErrorPage';

class QueryContainer extends Component {
  renderContainer({error, props}, back, PageComponent) {
    return (
      <div>
        {back &&
          <div className="back-button">
            <Link to="/">Back to <strong>collection</strong></Link>
          </div>
        }
        {
          (props && props.viewer &&
            <PageComponent viewer={props.viewer} />)
          || (((props && !props.viewer) || (error && error.code === 401)) &&
            <Login />)
          || (error &&
            <ErrorPage error={error} />)
          ||
            <Loading />
        }
      </div>
    );
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={this.props.query}
        render={(args) => this.renderContainer(
          args,
          this.props.back,
          this.props.component
        )}
      />
    );
  }
}

export default QueryContainer;
