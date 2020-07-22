import React, { Component } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import swal from 'sweetalert';

import { scanNetwork, setModeNull, setModeComplete, setTime } from '../actions';

const { ipcRenderer } = window.require('electron');


class Default extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "Initiating scan ..."
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    getStatus() {
        return (
            <React.Fragment>
                {this.state.message}
            </React.Fragment>
        );
    }

    handleCancel = () => {
        swal({
            title: "Are you sure you want to cancel scan?",
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
                ipcRenderer.invoke('KILL');
                window.location.href = "/";
                // this.props.setModeNull();
            }
        });
    }

    setScanTime(endTime, startTime) {
        return Math.floor(
            (endTime.getTime() - startTime.getTime())/1000
        );
    }

    componentDidMount() {
        let startTime = new Date();

        ipcRenderer.send('NETWORK', ["default"]);
        ipcRenderer.on('NETWORK', (e, resp) => {
            // console.log('here', resp)
            if (resp === "ERR") {
                swal({
                    title: "Something went wrong.",
                    text: "Please try again.",
                    icon: "error"
                }).then(() => {
                    window.location.href = "/";
                    // this.props.setModeNull();
                });
            } else {
                if (resp.indexOf("Scanning") === -1) {
                    let endTime = new Date();

                    this.props.setTime(this.setScanTime(endTime, startTime));

                    this.setState({ message: "Scan Complete. Please Wait ..." });

                    let results = JSON.parse(resp);
                    // console.log("DEFAULT")
                    // console.log(results)

                    this.props.scanNetwork(results);
                    this.props.setModeComplete();
                } else {
                    this.setState({ message: resp });
                }
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="vertical-center">
                    <div className="container">
                        <div style={{ marginBottom: '5em' }}>
                            <span style={titleFont}>
                                Vision Default Scan
                            </span>
                        </div>
                        <div className="vertical-center justify-content-center" style={{ minHeight: 0 }}>
                            <Spinner animation="grow" variant="info" />
                            <span style={{
                                marginLeft: '15px',
                                fontWeight: 500
                            }}>
                                Please wait while <i>Vision</i> scans the network.
                            </span>
                        </div>
                        <hr></hr>
                        {this.getStatus()}
                        <br></br>
                        <Button variant="danger" style={{ marginTop: '5em' }} onClick={this.handleCancel}>Cancel</Button>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


const titleFont = {
    fontWeight: 450,
    fontSize: '32px'
}

const reduxActions = { scanNetwork, setModeNull, setModeComplete, setTime }

export default connect(null, reduxActions)(Default);