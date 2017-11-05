import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  createPaginationContainer,
  graphql,
} from 'react-relay';
import Album from './Album';
import ErrorPage from './ErrorPage';
import FunctionLink from './FunctionLink';
import SearchWidget from './SearchWidget';
import './Collection.css';


class Collection extends React.Component {
  constructor(props) {
    super(props);
    this._handleSearch = this._handleSearch.bind(this);
    this._handleScroll = this._handleScroll.bind(this);
    this._loadMore = this._loadMore.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this._handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this._handleScroll);
  }

  _handleScroll() {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - (window.innerHeight/2))) {
      this._loadMore();
    }
  }
  _handleSearch(searchQuery) {
    // refetchConnection isn't supported properly yet for pagination container
    // so we reload the page instead
    // TODO: revisit this when refetchConnection is implemented
    /*this.props.relay.refetchConnection(
      12,
      e => {
        if (e) {
          console.log(e);
          //throw(e);
        } else {
          console.log('refetchConnection callback empty.');
        }
      },
      { search: "japan", test: "other" }
    );*/
    if (searchQuery && searchQuery.length) {
      this.props.history.push(`/search/${searchQuery}`);
    } else {
      this.props.history.push('/');
    }
  }
  _loadMore() {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(
      96, // Fetch the next feed items
      e => {
        if (e) {
          console.error(e);
          //throw(e);
        } else {
          //this._loadingMore = false;
        }
      },
    );
  }

  renderAlbums() {
    return this.props.viewer.collection.edges.map(edge =>
      <Album
        key={edge.node.id}
        album={edge.node}
        viewer={this.props.viewer}
      />
    );
  }
  renderLoadMore() {
    if (!this.props.relay.hasMore()) {
      return;
    }
    return (
      <FunctionLink onClick={this._loadMore}>
        Load more
      </FunctionLink>
    );
  }

  render() {
    if (!this.props.viewer.collection) {
      return <ErrorPage error={{code: 'RequiresCollection'}} />;
    }

    return (
      <div>
        <div className="main-intro">
          <SearchWidget
            value={this.props.match.params.searchQuery}
            onChange={this._handleSearch} />
          {/*this.props.viewer.discogsUser.numCollection &&
            <div className="collection-count">
              <strong>{this.props.viewer.discogsUser.numCollection}</strong> albums in collection.
            </div>
          */}
        </div>
        <div className="sleeves">
          {this.renderAlbums()}
        </div>
        {this.renderLoadMore()}
      </div>
    );
  }
}

export default createPaginationContainer(withRouter(Collection),
  {
  viewer: graphql`
    fragment Collection_viewer on Viewer {
      collection(
        first: $count
        after: $cursor
        search: $search # other variables
      ) @connection(key: "Collection_collection") {
        edges {
          node {
            id
            title
            ...Album_album
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      id
      ...Album_viewer
    }`
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.collection;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables(props, {count, cursor}, fragmentVariables) {
      return {
        count,
        cursor,
        // in most cases, for variables other than connection filters like
        // `first`, `after`, etc. you may want to use the previous values.
        search: fragmentVariables.search,
      };
    },
    query: graphql`
      query CollectionPaginationQuery(
        $count: Int!
        $cursor: String
        $search: String
      ) {
        viewer {
          # Reference to the fragment defined previously
          ...Collection_viewer
        }
      }
    `
  }
);
