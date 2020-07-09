import React, { Component } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
// import { Link } from 'react-router-dom'

class Options extends Component {
    render() {
        return (
            <React.Fragment>
                <br></br>
                <div className="container text-center">
                    <OverlayTrigger
                        key='bottom'
                        placement='bottom'
                        overlay={
                            <Tooltip id="tooltip-default">
                                <i>Vision</i> will scan the network for you.
                            </Tooltip>
                        }
                    >
                        <Button href="/default" variant="info" style={{ marginRight: "5px" }}>Let Vision Do The Dirty Work</Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        key='bottom'
                        placement='bottom'
                        overlay={
                            <Tooltip id="tooltip-custom">
                                Instruct <i>Vision</i> on how to scan.
                            </Tooltip>
                        }
                    >
                        <Button href="/custom" variant="info">Scan The Network Yourself</Button>
                    </OverlayTrigger>
                </div>
            </React.Fragment>
        )
    }
}

export default Options