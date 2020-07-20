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

    render() {
        return (
            <React.Fragment>
                <Toast id="toastBox" show={ this.state.active } style={{
                    height: '90px',
                    width: '270px',
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                }}>
                    <Toast.Header closeButton={false}>
                        <strong className="mr-auto">
                            Probing IP { this.state.ip } ...
                        </strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div className="vertical-center" style={{minHeight:0, paddingLeft:'5px'}}>
                            <Spinner animation="grow" variant="info" />  
                            <span style={{marginLeft:'10px'}}>
                                { this.state.os ? "Fingerprinting OS." : `Scanning port ${this.state.scanPort}.` }
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
                                            { host.OS ? host.OS : <Button id={`btnOS-${host.IP}`} variant="outline-primary" size="sm" onClick={() => { this.runOsScan(host.IP) }} disabled={ this.state.active }>Scan</Button> }
                                        </td>
                                        <td>
                                            <Button id={`btnPort-${host.IP}`} variant="outline-primary" size="sm" disabled={ this.state.active }>Scan</Button>
                                            <br></br>
                                            {host.Ports}
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