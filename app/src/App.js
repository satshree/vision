import React, { Component } from 'react';
import { Fade } from 'react-bootstrap'
import { Provider } from 'react-redux'

import Home from './pages/Home'
import Default from './pages/Default'
import Custom from './pages/Custom'
import Results from './pages/Results'
import store from './store'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      mode:null,
      subMode:null
    }

    store.subscribe(() => {
      let reduxState = store.getState().scanMode
      this.setState(reduxState)
    })
  }

  getComponentToRender() {
    if (this.state.mode === null) {
      // HOME PAGE 
      return (
        <React.Fragment>
          <Fade in={true}>
            <Home />
          </Fade>
        </React.Fragment>
      )
    } else if (this.state.mode === "DEFAULT") {
      // Default Scan 
      return (
        <React.Fragment>
          <Fade in={true}>
            <Default />
          </Fade>
        </React.Fragment>
      )
    } else if (this.state.mode === "CUSTOM") {
      // Custom Scan 
      return (
        <React.Fragment>
          <Fade in={true}>
            <Custom />
          </Fade>
        </React.Fragment>
      )
    } else if (this.state.mode === "COMPLETE") {
      // Results
      return (
        <React.Fragment>
          <Results />
        </React.Fragment>
      )
    }
  }

  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
            { this.getComponentToRender() }
        </React.Fragment>
      </Provider>
    );
  }
}

export default App