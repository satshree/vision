import React, { Component } from 'react';
import { Form } from 'react-bootstrap';

class Particular extends Component {
    render() {
        return (
            <React.Fragment>
                <Form id="particularForm">
                    <Form.Group>
                        <Form.Control type="text" name="onlyIP" />
                        <Form.Label className="form-control-placeholder">Enter IP Address</Form.Label>
                    </Form.Group>
                </Form>
            </React.Fragment>
        );
    }
}

export default Particular