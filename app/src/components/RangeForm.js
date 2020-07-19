import React, { Component } from 'react'
import { Row, Col, Form } from 'react-bootstrap'

class Range extends Component {
    render() {
        return (
            <React.Fragment>
                <Form id="rangeForm">
                    <Row>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Control type="text" name="firstIP" />
                                <Form.Label className="form-control-placeholder">First IP Address</Form.Label>
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group>
                                <Form.Control type="text" name="lastIP" />
                                <Form.Label className="form-control-placeholder">Last IP Address</Form.Label>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        )
    }
}

export default Range
