import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import Home from './pages/Home'
import Default from './pages/Default'
import Custom from './pages/Custom'
import Results from './pages/Results'
import store from './store'

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <BrowserRouter>
          {/* HOME PAGE */}
          <Route exact path="/" render={() => <Home />}></Route>

          {/* Default Scan */}
          <Route path="/default" render={() => <Default />}></Route>

          {/* Custom Scan */}
          <Route path="/custom" render={() => <Custom />}></Route>

          {/* Results */}
          <Route path="/results" render={() => <Results />}></Route>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
