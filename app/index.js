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
import Footer from './components/Footer';
import AuthRoute from './views/AuthRoute';

function App() {
  return (
    <BrowserRouter>
      <SemanticToastContainer />
      <Navigation />
      <div className="body">
        <Route exact path="/" component={Home} />
        <Route exact path="/repo" render={() => <AuthRoute><Repositories /></AuthRoute>} />
      </div>
      <Footer />
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
