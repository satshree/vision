import React, { Component } from 'react'
import { Table, Dropdown, DropdownButton } from 'react-bootstrap'

import '../assets/css/table.css'

class TableView extends Component {

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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>192.168.1.1</td>
                                <td>AB:DC:FE:GE:DV:SD</td>
                                <td>Apple</td>
                                <td>iPhone</td>
                                <td>iOS</td>
                                <td>34635</td>
                                <td>
                                    <DropdownButton variant="warning" title="Scan">
                                        <Dropdown.Item as="button">Port</Dropdown.Item>
                                        <Dropdown.Item as="button">Operating System</Dropdown.Item>
                                    </DropdownButton>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </React.Fragment>
        )
    }
}

export default TableView