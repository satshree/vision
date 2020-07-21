import React, { Component } from 'react';
import { Table, Button, Spinner, Toast } from 'react-bootstrap';
import { connect } from 'react-redux';

import { scanNetwork } from '../actions';

import '../assets/css/table.css';

const { ipcRenderer } = window.require('electron');

class TableView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ip:"",
            active:false,
            os:false,
            port:false,
            scanPort:0
        }
    }

    getData() {
        return this.props.data
    }

    updateReduxData(data) {
        this.props.scanNetwork(data);
    }

    updateOS(os) {
        let data = this.getData();
        let { ip } = this.state

        // console.log("TABLE")
        // console.log(data)

        for (let host of data.hosts) {
            if (host.IP === ip) {
                host.OS = os;
                break;
            }
        }

        // console.log("AFTER")
        // console.log(data)
        this.updateReduxData(data);
        this.setState({ ...this.state, ip:"", os:false, active:false });
    }

    runOsScan(ip) {
        this.setState({ ...this.state, ip, os:true, active:true });
        

        ipcRenderer.send('OS', [ip]);
        ipcRenderer.on('OS', (e, resp) => {
            this.updateOS(resp);
        })
    }

    getOSBtn = (host) => { 
        let os = host.OS;
        let ip = host.IP;

        if (os) {
            return (
                <React.Fragment>
                    { os }
                    <Button id={`btnOS-${ip}`} style={{ marginTop:'5px' }} variant="outline-primary" size="sm" onClick={() => { this.runOsScan(ip) }} disabled={ this.state.active }>
                        Re-Scan
                    </Button> 
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <Button id={`btnOS-${ip}`} variant="outline-primary" size="sm" onClick={() => { this.runOsScan(ip) }} disabled={ this.state.active }>
                        Scan
                    </Button> 
                </React.Fragment>
            );
        }
    }

    getPortBtn = (host) => {
        let ports = host.Ports;
        let ip = host.IP;

        if (ports.length !== 0) {
            return (
                <React.Fragment>
                    {ports}
                    <br></br>
                    <Button id={`btnPort-${ip}`} style={{ marginTop:'5px' }} variant="outline-primary" size="sm" disabled={ this.state.active }>
                        Re-Scan
                    </Button>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <Button id={`btnPort-${ip}`} variant="outline-primary" size="sm" disabled={ this.state.active }>
                        Scan
                    </Button> 
                </React.Fragment>
            );
        }
    }

    render() {
        return (
            <React.Fragment>
                <Toast id="osToastBox" show={ this.state.os } style={{
                    height: '90px',
                    width: '270px',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    borderRadius:'5px',
                    boxShadow: '0px 0px 5px 2px #999'
                }}>
                    <Toast.Header closeButton={false}>
                        <strong className="mr-auto">
                            Fingerprinting OS.
                        </strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div className="vertical-center" style={{minHeight:0, paddingLeft:'5px'}}>
                            <Spinner animation="grow" variant="info" />  
                            <span style={{marginLeft:'10px'}}>
                                Probing IP { this.state.ip } ...
                            </span>
                        </div>
                    </Toast.Body>
                </Toast>
                <Toast id="portToastBox" show={ this.state.port } style={{
                    height: '90px',
                    width: '270px',
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                }}>
                    <Toast.Header closeButton={false}>
                        <strong className="mr-auto">
                            Scanning Port of { this.state.ip }.
                        </strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div className="vertical-center" style={{minHeight:0, paddingLeft:'5px'}}>
                            <Spinner animation="grow" variant="info" />  
                            <span style={{marginLeft:'10px'}}>
                                Probing port { this.state.scanPort } ...
                            </span>
                        </div>
                    </Toast.Body>
                </Toast>
                <div className="fixed-header">
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>IP Address</th>
                                <th>MAC Address</th>
                                <th>Manufacturer</th>
                                <th>Hostname</th>
                                <th>Operating System</th>
                                <th>Open Ports</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.getData().hosts.map(host => {
                                return (
                                    <tr key={host.IP}>
                                        <td>{host.IP}</td>
                                        <td>{host.MAC}</td>
                                        <td>{host.Vendor}</td>
                                        <td>{host.Hostname}</td>
                                        <td>
                                            { this.getOSBtn(host) }
                                        </td>
                                        <td>
                                            { this.getPortBtn(host) }
                                        </td>
                                    </tr>
                                );
                            }) }
                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, { scanNetwork })(TableView)