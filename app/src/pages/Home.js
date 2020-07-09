import React, { Component } from 'react';

import Head from '../components/Head'
import Options from '../components/Options'

class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <br></br>
                <br></br>
                <div className="container">
                    <Head />
                    <hr></hr>
                </div>
                <Options />
                <div className="container" style={box}>
                    <hr></hr>
                    With <i>Vision</i>, you can scan your local network and 
                    list out the online devices.
                    <br></br> <br></br>
                    <span style={{fontWeight:'700'}}>
                        Whatever you do next is in your hands.
                    </span>
                </div>
            </React.Fragment>
        )
    }
}

export default Home

const box = {
    paddingLeft: '10em',
    paddingRight: '10em',
    marginTop: '150px',
    textAlign: 'center'
}