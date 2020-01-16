import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { SemanticToastContainer } from 'react-semantic-toasts';

import './index.css';
import 'semantic-ui-css/semantic.min.css';
import 'react-semantic-toasts/styles/react-semantic-alert.css';

import Home from './views/Home';
import Repositories from './views/Repositories';
import Navigation from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <SemanticToastContainer />
      <Navigation />
      <Route exact path="/" component={Home} />
      <Route exact path="/repo" component={Repositories} />
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
