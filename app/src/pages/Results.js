import React, { Component } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { connect } from 'react-redux';

import { setModeNull } from '../actions';

import Graphs from '../components/Graphs';
import TableView from '../components/Table';

import '../assets/css/nav-pills.css';
import '../assets/css/results.css';

import loading from '../assets/loading2.gif';

const { ipcRenderer } = window.require('electron');

class Results extends Component {
    constructor(props) {
        super(props);

        this.state = {
            saving:false
        }
    }

    returnHome = () => {
        if (this.props.imported !== "IMPORTED") {
            swal({
                title: "Discard Results?",
                icon: "warning",
                buttons: {
                    cancel: {
                        visible: true,
                        value: false,
                        text: "No"
                    },
                    confirm: {
                        visible: true,
                        value: true,
                        text: "Yes"
                    }
                },
                dangerMode: true
            }).then((resp) => {
                if (resp) {
                    window.location.href = "";
                    // this.props.setModeNull();
                }
            });
        } else {
            // this.props.setModeNull();
            window.location.href = "";
        }
    }

    getData() {
        return this.props.results
    }

    getGraphData() {
        let results = this.getData().organized;

        let labels = []
        let data = []
        let backgroundColor = []
        let borderColor = []

        for (let host of results) {
            let colorR = Math.floor((Math.random() * 300) + 1);
            let colorG = Math.floor((Math.random() * 300) + 1);
            let colorB = Math.floor((Math.random() * 300) + 1);
    
            let background = `rgba(${colorR}, ${colorG}, ${colorB}, 0.1)`
            let border = `rgba(${colorR}, ${colorG}, ${colorB}, 1)`

            labels.push(host.Vendor);
            data.push(host.Count);
            backgroundColor.push(background);
            borderColor.push(border);
        }

        return {
            labels,
            datasets: [{
                label: 'Total Devices',
                data,
                backgroundColor,
                borderColor,
                borderWidth: 1
            }]
        }
    }

    getTime() {
        return this.props.time
    }

    getTotalHost() {
        let results = this.getData().organized
        let count = 0

        for (let host of results) {
            count += host.Count
        }

        return count
    }

    saveData = () => {
        this.setState({saving:true});

        let data = JSON.stringify(this.getData().hosts);

        ipcRenderer.send('SAVE', data);
        ipcRenderer.on('SAVE', (e, resp) => {
            if (parseInt(resp) === 1) {
                swal({
                    title:"Results Saved.",
                    text:"Results are saved in a 'vision.csv' file in your desktop.",
                    icon:"success"
                })
                .then(() => this.setState({saving:false}));
            } else {
                swal({
                    title:"Something went wrong.",
                    text:"Please Try Again.",
                    icon:"warning"
                })
                .then(() => this.setState({saving:false}));
            }
        });
    }

    getMetaData = () => {
        if (this.props.imported === "IMPORTED") {
            return (
                <React.Fragment>
                    <small>{ this.props.results.meta }</small>
                    {' | '}
                    <small>Total Devices Scanned: <strong>{this.getTotalHost()}</strong></small>
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <small>Total Time Taken for scan: <strong>{this.getTime()} seconds</strong>, Roughly { Math.floor(this.getTime()/60) } minutes.</small>
                    {' | '}
                    <small>Total Devices Scanned: <strong>{this.getTotalHost()}</strong></small>
                </React.Fragment>
            );
        }
    }

    disableBtn = () => {
        if ((this.props.active) || (this.props.imported === "IMPORTED")) {
            return true;
        } else {
            return false;
        }
    }

    getSaveBtn = () => {
        if (this.state.saving) {
            return (
                <React.Fragment>
                    <Button variant="success" disabled={ true }>
                        <img src={loading} alt="loading gif" style={{marginRight:'5px', width:'25px'}}></img>Saving ...
                    </Button>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Button variant="success" onClick={this.saveData} disabled={ this.disableBtn() }>Save</Button>
                </React.Fragment>
            )
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="vertical-center">
                    <div className="container">
                        <div className="title">
                            <span style={{ fontSize: '32px' }}>Vision Scan Results</span>
                        </div>
                        <div className="results">
                            <hr></hr>
                            <div className="tabs">
                                <Tabs defaultActiveKey="graph" className="d-flex justify-content-center" variant="pills" id="uncontrolled-tab">
                                    <Tab eventKey="graph" title="Graphical View">
                                        <Graphs data={this.getGraphData()} />
                                    </Tab>
                                    <Tab eventKey="table" title="Tabular View">
                                        <TableView data={this.getData()} />
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                        <div className="scan-data">
                            <hr></hr>
                            { this.getMetaData() }
                        </div>
                        <hr></hr>
                        <div className="btns">
                            <Button variant="info" onClick={this.returnHome} disabled={ this.props.active }>Home</Button>
                            { this.getSaveBtn() }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    results: state.data,
    time: state.scanTime,
    active: state.activeProcess,
    imported: state.scanMode.subMode
})

export default connect(mapStateToProps, { setModeNull })(Results);