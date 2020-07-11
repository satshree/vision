import React, { Component } from 'react';

import Head from '../components/Head'
import Options from '../components/Options'

class Home extends Component {
    
    getSystemIP() {
        // var os = require('os')
        // let ifaces = os.networkInterfaces();
        
        // Object.keys(ifaces).forEach(function (ifname) {
        //     console.log("here", ifname)
        // })

        // return ifaces.toString();
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
                                Your IP Address: 192.168.1.10
                            </em>
                            <br></br>
                            <em>
                                Your Gateway Address: 192.168.1.1
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
        )
    }
}

export default Home

const box = {
    paddingLeft: '10em',
    paddingRight: '10em',
    marginTop: '50px',
    textAlign: 'center'
}