import React, { Component } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { connect } from 'react-redux';

import { setModeNull } from '../actions';

import Graphs from '../components/Graphs';
import TableView from '../components/Table';

import '../assets/css/nav-pills.css';
import '../assets/css/results.css';

class Results extends Component {
    returnHome = () => {
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
                window.location.href = "/";
                // this.props.setModeNull();
            }
        });
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
                            <small>Total Time Taken for scan: <strong>{this.getTime()} seconds</strong>, Roughly { Math.floor(this.getTime()/60) } minutes.</small>
                            {' | '}
                            <small>Total Devices Scanned: <strong>{this.getTotalHost()}</strong></small>
                        </div>
                        <hr></hr>
                        <div className="btns">
                            <Button variant="info" onClick={this.returnHome} disabled={ this.props.active }>Home</Button>
                            <Button variant="success" disabled={ this.props.active }>Save</Button>
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
    active: state.activeProcess
})

export default connect(mapStateToProps, { setModeNull })(Results);