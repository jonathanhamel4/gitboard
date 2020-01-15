import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import './index.css';

import 'semantic-ui-css/semantic.min.css';
import Home from './views/Home';
import Repositories from './views/Repositories';
import Navigation from './components/Navigation';

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Route exact path="/" component={Home} />
            <Route exact path="/repo" component={Repositories} />
        </BrowserRouter>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))