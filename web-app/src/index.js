import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import PlaylistContainer from './components/PlaylistContainer';
import ScrobbleContainer from './components/ScrobbleContainer';
import LoggingInDiscogs from './components/LoggingInDiscogs';
import LoggingInLastfm from './components/LoggingInLastfm';

ReactDOM.render(
  <BrowserRouter>
    <div className="App">
      <Header />
      <section className="main">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search/:searchQuery" component={Home} />
          <Route path="/playlist" component={PlaylistContainer} />
          <Route path="/scrobble" component={ScrobbleContainer} />
          <Route path="/loginDiscogs" component={LoggingInDiscogs}  />
          <Route path="/loginLastfm" component={LoggingInLastfm}  />
          <Route path="*" render={() => <h1>Not found</h1>} />
        </Switch>
      </section>
      <Footer />
    </div>
  </BrowserRouter>
  , document.getElementById('root')
);
registerServiceWorker();
