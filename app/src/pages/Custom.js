import React, { Component } from 'react'
import { Button, Tab, Nav, Row, Col, ProgressBar } from 'react-bootstrap'
import { connect } from 'react-redux'
import swal from 'sweetalert'

import { setModeNull } from '../actions'

import Range from '../components/RangeForm'
import Particular from '../components/ParticularForm'

import '../assets/css/nav-pills.css'
import '../assets/css/form.css'

class Custom extends Component {
    state = {
        key: "range",
        input: true
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

    getProgress() {
        return (
            <React.Fragment>
                <div className="progress-box">
                    <span style={{
                        fontWeight: 500
                    }}>
                        <i>Vision</i> is scanning network.
                    </span>
                    <div className="status" style={{ marginTop: '1em' }}>
                        Scanning IP: 192.168.1.1 | Reply: Positive
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

    getForms() {
        return (
            <React.Fragment>
                <div className="inputs">
                    <Tab.Container activeKey={this.state.key}
                        onSelect={(key) => this.setState({ input: this.state.input, key })}>
                        <Row>
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="range">Scan IP Range</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="particular">Scan Particular IP</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="range">
                                        <div className="form-title">
                                            Scan Range of IP Address
                                                                </div>
                                        <Range />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="particular">
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
                        <Button type="button" variant="success" onClick={() => { this.setState({ input: !this.state.input, key: this.state.key }) }}>Scan</Button>
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

export default connect(null, { setModeNull })(Custom)

const titleFont = {
    fontWeight: 450,
    fontSize: '32px'
}