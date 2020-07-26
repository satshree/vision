import React, { Component } from 'react';
import { Fade } from 'react-bootstrap';
import { Provider } from 'react-redux';

import Home from './pages/Home';
import Default from './pages/Default';
import Custom from './pages/Custom';
import Results from './pages/Results';
import Others from './pages/Others';

import store from './store';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode:null,
      subMode:null
    }

    store.subscribe(() => {
      let reduxState = store.getState().scanMode;
      this.setState(reduxState);
    });
  }

  getComponentToRender() {
    if (this.state.mode === null) {
      // HOME PAGE 
      return (
        <React.Fragment>
            <Home />
        </React.Fragment>
      );
    } else if (this.state.mode === "DEFAULT") {
      // Default Scan 
      return (
        <React.Fragment>
            <Default />
        </React.Fragment>
      );
    } else if (this.state.mode === "CUSTOM") {
      // Custom Scan 
      return (
        <React.Fragment>
            <Custom />
        </React.Fragment>
      );
    } else if (this.state.mode === "OTHERS") {
        // Other Features 
        return (
          <React.Fragment>
              <Others />
          </React.Fragment>
        );
    } else if (this.state.mode === "COMPLETE") {
      // Results
      return (
        <React.Fragment>
          <Results />
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
          <Fade in={true}>
            { this.getComponentToRender() }
          </Fade>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App