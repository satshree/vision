import React, { Component } from 'react'
import { Spinner, Button } from 'react-bootstrap'
import swal from 'sweetalert'

class Default extends Component {
    getStatus() {
        return (
            <React.Fragment>
                Scanning Host: 192.168.1.1 | Scan Attempt: 2
            </React.Fragment>
        )
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
                window.location.href = "/"
            }
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="vertical-center">
                    <div className="container">
                        <div style={{marginBottom:'5em'}}>
                            <span style={titleFont}>
                                Default Scan
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
        )
    }
}

export default Default

const titleFont = {
    fontWeight: 450,
    fontSize:'35px'
}