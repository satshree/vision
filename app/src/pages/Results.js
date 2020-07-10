import React, { Component } from 'react'
import { Tabs, Tab } from 'react-bootstrap'

import Head from '../components/Head'
import Graphs from '../components/Graphs'

import '../assets/css/nav-pills.css'
import '../assets/css/results.css'

class Results extends Component {
    render() {
        var data = {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
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

        return (
            <React.Fragment>
                <br></br>
                <br></br>
                <div className="container">
                    <Head />
                    <hr></hr>
                    <br></br>
                    <div className="tabs">
                        <Tabs defaultActiveKey="graph" className="d-flex justify-content-center" variant="pills" id="uncontrolled-tab">
                            <Tab eventKey="graph" title="Graphical View">
                                <Graphs data={data} />
                            </Tab>
                            <Tab eventKey="table" title="Tabular View">
                                TABLE
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Results