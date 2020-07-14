import React, { Component } from 'react'
import { Tabs, Tab, Button } from 'react-bootstrap'
import swal from 'sweetalert'
import { connect } from 'react-redux'

import Graphs from '../components/Graphs'
import TableView from '../components/Table'

import '../assets/css/nav-pills.css'
import '../assets/css/results.css'

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
                window.location.href = "/"
            }
        })
    }

    getData() {
        console.log("RESULTS")
        console.log(this.props)

        return {
            labels: ['Apple', 'Dell', 'Samsung', 'Cisco'],
            datasets: [{
                label: 'Total Devices',
                data: [3, 4, 2, 1],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
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
                                        <Graphs data={this.getData()} />
                                    </Tab>
                                    <Tab eventKey="table" title="Tabular View">
                                        <TableView data={this.getData()}/>
                                    </Tab>
                                </Tabs>
                            </div>
                        </div>
                        <div className="scan-data">
                            <hr></hr>
                            <small>Total Time Taken for scan: <strong>55 seconds</strong></small>
                            {' | '}
                            <small>Total Devices Scanned: <strong>13</strong></small>
                        </div>
                        <hr></hr>
                        <div className="btns">
                            <Button variant="info" onClick={this.returnHome}>Home</Button>
                            <Button variant="success">Save</Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    results: state
})

export default connect(mapStateToProps, {})(Results)