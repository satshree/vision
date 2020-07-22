import React, { Component } from 'react';
import { connect } from 'react-redux';

import { scanNetwork } from '../actions';

import Head from '../components/Head';
import Options from '../components/Options';

const { ipcRenderer } = window.require('electron');

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ip:"...",
            gateway:"..."
        }
    }

    componentDidMount() {
        this.getSystemIP();
    }
    
    getSystemIP = async () => {
        const ip = await ipcRenderer.invoke('SYSTEM_IP');
        this.setState(ip);
    }

    getIP = () => {
        return this.state.ip;
    }

    getGateway = () => {
        return this.state.gateway;
    }

    render() {
        return (
            <React.Fragment>
                <div className="vertical-center">
                    <div className="container">
                        <Head />
                        <hr></hr>
                        <Options />
                        <br></br>
                        <div className="text-center" style={{marginTop:'50px'}}>
                            <em>
                                Your IP Address: { this.getIP() }
                            </em>
                            <br></br>
                            <em>
                                Your Gateway Address: { this.getGateway() }
                            </em>
                        </div>
                        <div className="container" style={box}>
                            <hr></hr>
                                With <i>Vision</i>, you can scan your local network and
                                list out the online devices.
                                <br></br> <br></br>
                            <span style={{ fontWeight: '700' }}>
                                Whatever you do next is in your hands.
                                </span>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


const box = {
    paddingLeft: '10em',
    paddingRight: '10em',
    marginTop: '50px',
    textAlign: 'center'
}

export default connect(null, { scanNetwork })(Home);