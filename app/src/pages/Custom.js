import React, { Component } from 'react'
import { Button, Tab, Nav, Row, Col } from 'react-bootstrap'

import Range from '../components/RangeForm'
import Particular from '../components/ParticularForm'

import '../assets/css/nav-pills.css'
import '../assets/css/form.css'

class Custom extends Component {
    state = {
        key: "range"
    }

    render() {
        return (
            <React.Fragment>
                <div className="vertical-center">
                    <div className="container">
                        <div style={{ marginBottom: '3em' }}>
                            <span style={titleFont}>
                                Custom Scan
                            </span>
                            <hr></hr>
                        </div>
                        <div className="tabs">
                            <Tab.Container activeKey={this.state.key}
                            onSelect={(key) => this.setState({key})}>
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
                        </div>
                        <br></br>
                        <div className="btns" style={{ marginTop: '1em' }}>
                            <Button href="/" variant="info" style={{ marginRight: '1em' }}>Back</Button>
                            <Button type="button" variant="success">Scan</Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Custom

const titleFont = {
    fontWeight: 450,
    fontSize: '35px'
}