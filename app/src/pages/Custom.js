import React, { Component } from 'react'
import { Button, Tab, Nav, Row, Col, ProgressBar } from 'react-bootstrap'
import { connect } from 'react-redux'
import swal from 'sweetalert'
import $ from 'jquery'

import { setModeNull, setModeCustomRange, setModeCustomOnly, setModeComplete, setTime, scanNetwork } from '../actions'

import Range from '../components/RangeForm'
import Particular from '../components/ParticularForm'

import '../assets/css/nav-pills.css'
import '../assets/css/form.css'

const { ipcRenderer } = window.require('electron')

class Custom extends Component {
    constructor(props) {
        super(props)

        this.state = {
            key: this.props.mode.subMode,
            input: true,
            message:"Initiating scan ...",
            progress:0,
            value:null
        }
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
                this.setState({...this.state, input: true })
            }
        })
    }

    changeMode = (key) => {
        this.setState({ ...this.state, key })

        this.state.key === "Only" ? this.props.setModeCustomRange() : this.props.setModeCustomOnly()
    }

    setScanTime(endTime, startTime) {
        return Math.floor(
            (endTime.getTime() - startTime.getTime())/1000
        )
    }

    runScript = () => {
        this.setState({...this.state, input:false})
        let startTime = new Date()

        let scanMode;
        let value;

        if (this.state.key === "Range") {
            scanMode = "range"
            value = this.state.value.split(" ")
        } else {
            scanMode = "particular"
            value = this.state.value
        }

        ipcRenderer.send('NETWORK', [scanMode, value])
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

                    this.setState({...this.state, message: "Scan Complete. Please Wait ..." })

                    let results = JSON.parse(resp)

                    this.props.scanNetwork(results)
                    this.props.setModeComplete()
                } else {
                    let message;
                    let progress;
                    if (resp.indexOf(",") === -1) {
                        message = resp
                        progress = 0
                    } else {
                        message = resp.split(",")[0]
                        progress = resp.split(",")[1]
                    }

                    this.setState({...this.state, message, progress })
                }
            }
        });
    }

    startScan = () => {
        let { key } = this.state
        let value;

        if (key === "Range") {
            value = `${$("input[name='firstIP']").val()} ${$("input[name='lastIP']").val()}`
        } else {
            value = $("input[name='onlyIP']").val()
        }

        this.setState({...this.state, value}, () => {
            let validIP = this.validateIP(value.split(" "))
    
            if (validIP) {
                this.runScript()
            } else {
                swal({
                    title:"Invalid IP Address.",
                    icon:"warning"
                })
            }
        })

    }

    validateIP(ipAddresses) {
        for (let ip of ipAddresses) {
            if (
                !(
                /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)
                )
            )
            {
                return false
            }
        }

        return true
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
                    <ProgressBar animated={true} now={this.state.progress} label={`${this.state.progress} %`} style={{ marginTop: '1em' }} />
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
    setModeCustomOnly,
    setModeComplete,
    setTime,
    scanNetwork
}

const mapStateToProps = (state) => ({
    mode:state.scanMode
})

export default connect(mapStateToProps, reduxActions)(Custom)
