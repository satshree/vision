import React, { Component } from 'react'
import { Button, Tab, Nav, Row, Col, ProgressBar } from 'react-bootstrap'
import { connect } from 'react-redux'
import swal from 'sweetalert'

import { setModeNull, setModeCustomRange, setModeCustomOnly } from '../actions'

import Range from '../components/RangeForm'
import Particular from '../components/ParticularForm'

import '../assets/css/nav-pills.css'
import '../assets/css/form.css'

const { ipcRenderer } = window.require('electron')

class Custom extends Component {
    state = {
        key: this.props.mode.subMode,
        input: true,
        message:"Scanning IP: 192.168.1.1 | Reply: Positive"
    }

    handlePartialCancel = () => {
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
                this.setState({ input: true, key: this.state.key })
            }
        })
    }

    changeMode = (key) => {
        this.setState({ ...this.state, key })

        this.state.key === "Only" ? this.props.setModeCustomRange() : this.props.setModeCustomOnly()
    }

    runScript = () => {
        let startTime = new Date()

        ipcRenderer.send('NETWORK', ["range"])
        ipcRenderer.on('NETWORK', (e, resp) => {
            // console.log('here', resp)
            if (resp === "ERR") {
                swal({
                    title: "Something went wrong.",
                    text: "Please try again.",
                    icon: "error"
                }).then(() => this.props.setModeNull())
            } else {
                if (resp.indexOf("Scanning") === -1) {
                    let endTime = new Date()

                    this.props.setTime(this.setScanTime(endTime, startTime))

                    this.setState({ message: "Scan Complete. Please Wait ..." })

                    let results = JSON.parse(resp)
                    // console.log("DEFAULT")
                    // console.log(results)

                    this.props.scanNetwork(results)
                    this.props.setModeComplete()
                } else {
                    this.setState({ message: resp })
                }
            }
        });
    }

    startScan = () => {

    }

    getProgress = () => {
        return (
            <React.Fragment>
                <div className="progress-box">
                    <span style={{
                        fontWeight: 500
                    }}>
                        <i>Vision</i> is scanning network.
                    </span>
                    <div className="status" style={{ marginTop: '1em' }}>
                        { this.state.message }
                    </div>
                    <ProgressBar animated={true} now={50} style={{ marginTop: '1em' }} />
                    <br></br>
                    <div className="btns">
                        <Button variant="danger" style={{ marginRight: '1em' }} onClick={this.handlePartialCancel}>Cancel</Button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    getForms = () => {
        return (
            <React.Fragment>
                <div className="inputs">
                    <Tab.Container activeKey={this.state.key}
                        onSelect={(key) => this.changeMode(key)}>
                        <Row>
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="Range">Scan IP Range</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="Only">Scan Particular IP</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="Range">
                                        <div className="form-title">
                                            Scan Range of IP Address
                                                                </div>
                                        <Range />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="Only">
                                        <div className="form-title">
                                            Probe a Particular IP Addresses
                                                                </div>
                                        <Particular />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                    <br></br>
                    <div className="btns" style={{ marginTop: '1em' }}>
                        <Button onClick={ this.props.setModeNull } variant="info" style={{ marginRight: '1em' }}>Back</Button>
                        <Button type="button" variant="success" onClick={ this.startScan }>Scan</Button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    render() {
        return (
            <React.Fragment>
                <div className="vertical-center">
                    <div className="container">
                        <div style={{ marginBottom: '3em' }}>
                            <span style={titleFont}>
                                Vision Custom Scan
                                </span>
                            <hr></hr>
                        </div>
                        {!this.state.input ? this.getProgress() : this.getForms()}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const titleFont = {
    fontWeight: 450,
    fontSize: '32px'
}

const reduxActions = {
    setModeNull,
    setModeCustomRange,
    setModeCustomOnly
}

const mapStateToProps = (state) => ({
    mode:state.scanMode
})

export default connect(mapStateToProps, reduxActions)(Custom)
