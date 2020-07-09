import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

class Custom extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="vertical-center">
                    <div className="container">
                        <div style={{ marginBottom: '5em' }}>
                            <span style={titleFont}>
                                Custom Scan
                            </span>
                        <hr></hr>
                        </div>
                        
                        <br></br>
                        <Button href="/" variant="info" style={{ marginTop: '5em' }}>Back</Button>
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