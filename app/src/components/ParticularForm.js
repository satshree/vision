import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

class Particular extends Component {
    render() {
        return (
            <React.Fragment>
                <Form id="particularForm">
                    <Form.Group className="material-form-group">
                        <Form.Control type="text" name="onlyIP" className="material-form-control"/>
                        <Form.Label className="material-form-control-placeholder">Enter IP Address</Form.Label>
                    </Form.Group>
                </Form>
            </React.Fragment>
        );
    }
}

export default Particular