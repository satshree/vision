import React, { Component } from 'react';
import { Row, Col, Form } from 'react-bootstrap';

class Range extends Component {
    render() {
        return (
            <React.Fragment>
                <Form id="rangeForm">
                    <Row>
                        <Col sm={6}>
                            <Form.Group className="material-form-group">
                                <Form.Control type="text" name="firstIP" className="material-form-control" onKeyPress={ this.props.keyPress } />
                                <Form.Label className="material-form-control-placeholder">First IP Address</Form.Label>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group className="material-form-group">
                                <Form.Control type="text" name="lastIP" className="material-form-control" onKeyPress={ this.props.keyPress } />
                                <Form.Label className="material-form-control-placeholder">Last IP Address</Form.Label>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        );
    }
}

export default Range
