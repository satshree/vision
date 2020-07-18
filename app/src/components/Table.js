import React, { Component } from 'react'
import { Table, Button } from 'react-bootstrap'

import '../assets/css/table.css'

class TableView extends Component {
    getData() {
        return this.props.data.hosts
    }

    render() {
        return (
            <React.Fragment>
                <div className="fixed-header">
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>IP Address</th>
                                <th>MAC Address</th>
                                <th>Manufacturer</th>
                                <th>Hostname</th>
                                <th>Operating System</th>
                                <th>Open Ports</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.getData().map(host => {
                                return (
                                    <tr key={host.IP}>
                                        <td>{host.IP}</td>
                                        <td>{host.MAC}</td>
                                        <td>{host.Vendor}</td>
                                        <td>{host.Hostname}</td>
                                        <td>
                                            { host.OS ? host.OS : <Button variant="warning">Scan</Button> }
                                        </td>
                                        <td>
                                            <Button variant="warning">Scan</Button>
                                            <br></br>
                                            {host.Ports}
                                        </td>
                                    </tr>
                                )
                            }) }
                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        )
    }
}

export default TableView