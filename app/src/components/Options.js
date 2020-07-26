import React, { Component } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect } from 'react-redux';

import { setModeDefault, setModeCustomRange, setModeOthers } from '../actions';

class Options extends Component {
    render() {
        return (
            <React.Fragment>
                <br></br>
                <div className="container text-center">
                    <OverlayTrigger
                        key='default'
                        placement='bottom'
                        overlay={
                            <Tooltip id="tooltip-default">
                                <i>Vision</i> will scan the network for you.
                            </Tooltip>
                        }
                    >
                        <Button onClick={this.props.setModeDefault} variant="info" style={{ marginRight: "5px" }}>Let Vision Do The Dirty Work</Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        key='custom'
                        placement='bottom'
                        overlay={
                            <Tooltip id="tooltip-custom">
                                Instruct <i>Vision</i> on how to scan.
                            </Tooltip>
                        }
                    >
                        <Button onClick={this.props.setModeCustomRange} variant="info">Scan The Network Yourself</Button>
                    </OverlayTrigger>
                    <br></br>
                    <br></br>
                    <OverlayTrigger
                        key='other'
                        placement='top'
                        overlay={
                            <Tooltip id="tooltip-other">
                                Explore <i>Vision's</i> other features.
                            </Tooltip>
                        }
                    >
                        <Button onClick={this.props.setModeOthers} variant="outline-info">Other</Button>
                    </OverlayTrigger>
                </div>
            </React.Fragment>
        );
    }
}

const reduxActions = { 
    setModeDefault, 
    setModeCustomRange,
    setModeOthers 
}

export default connect(null, reduxActions)(Options);