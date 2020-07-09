import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import Home from './pages/Home'
import Default from './pages/Default'
import Custom from './pages/Custom'

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        {/* HOME PAGE */}
        <Route exact path="/" render={() => <Home />}></Route>

        {/* Default Scan */}
        <Route exact path="/default" render={() => <Default />}></Route>

        {/* Custom Scan */}
        <Route exact path="/custom" render={() => <Custom />}></Route>
      </BrowserRouter>
    );
  }
}

export default App;
