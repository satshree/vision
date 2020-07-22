import React, { Component } from 'react';
import { Modal, Button, Toast, Spinner, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { v4 as uuid4 } from 'uuid';
import swal from 'sweetalert';

import { scanNetwork, setActiveProcess, removeActiveProcess } from '../actions';

const { ipcRenderer } = window.require('electron');

const defaultMessage = ""

class Ports extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ip: this.props.ip,
            ports: [],
            scanPort:[
                {
                    id:uuid4(),
                    value:''
                }
            ],
            message:defaultMessage,
            showToast:false,
            showModal: false
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state,callback)=>{
            return;
        };
    }

    updateReduxData(data) {
        this.props.scanNetwork(data);
    }

    updateData = () => {
        let data = this.props.data;
        let { ip } = this.state
        let { ports } = this.state
        

        for (let host of data.hosts) {
            if (host.IP === ip) {
                host.Ports = ports;
                break;
            }
        }

        this.updateReduxData(data);
        this.setState({ ...this.state, showToast:false, message:defaultMessage });
        this.props.removeActiveProcess();
    }

    runPortScan = () => {
        let { ip } = this.state
        let { scanPort } = this.state

        let allPorts = [];
        let proceed = true;

        scanPort.map(obj => {
            if (!obj.value) {
                proceed = false;
            }
            allPorts.push(obj.value);
        });

        if (proceed) {
            this.setState({...this.state, showToast:true, showModal:false});

            this.props.setActiveProcess();

            ipcRenderer.send('PORT', [ip, allPorts]);
            ipcRenderer.on('PORT', (e, resp) => {
                if(resp.indexOf("Probing") === -1) {
                    this.setState({...this.state, message:"Complete.", ports:JSON.parse(resp)});
                    this.updateData();
                } else {
                    this.setState({...this.state, message:resp});
                }
            })
        } else {
            swal({
                title:"Enter all ports before scanning!",
                icon:"warning"
            })
        } 
    }

    showModal = () => {
        this.setState({...this.state, showModal:true});
    }
    
    hideModal = () => {
        this.setState({...this.state, showModal:false});
    }

    getAllActivePorts = () => {
        let ports = this.state.scanPort.map((obj, index) => {
            let port = obj.value;

            if (index === (this.state.scanPort.length - 1)) {
                return `${port}`;
            } else {
                return `${port}, `;
            }
        });

        return ports
    }

    getAllOpenPorts = () => {
        let ports = this.state.ports.map((port, index) => {
            if (index === (this.state.ports.length - 1)) {
                return `${port}`;
            } else {
                return `${port}, `;
            }
        });

        return (
            <React.Fragment>
                <span style={{ fontSize:'12px' }}>
                    { ports }
                </span>
            </React.Fragment>
        )
    }

    getBtn = () => {
        var { ports } = this.state;

        if (ports.length === 0) {
            return (
                <React.Fragment>
                    <Button id={`btnPort-${this.state.ip}`} variant="outline-primary" size="sm" onClick={ this.showModal } disabled={ this.props.active }> 
                        Scan
                    </Button>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    { this.getAllOpenPorts() }
                    <br></br>
                    <Button id={`btnPort-${this.state.ip}`} style={{ marginTop:'5px' }} variant="outline-primary" size="sm" onClick={ this.showModal } disabled={ this.props.active }> 
                        Re-Scan
                    </Button>
                </React.Fragment>
            );  
        }
    }

    removePort = (index) => {
        let { scanPort } = this.state;

        scanPort.splice(index, 1);

        this.setState({...this.state, scanPort});
    }

    render() {
        var { scanPort } = this.state;
        return (
            <React.Fragment>
                <Toast id="portToastBox" show={ this.state.showToast } style={{
                    height: '120px',
                    width: '270px',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    borderRadius:'5px',
                    boxShadow: '0px 0px 5px 2px #999'
                }}>
                    <Toast.Header closeButton={false}>
                        <strong className="mr-auto">
                            Scanning Ports { this.getAllActivePorts() } of { this.state.ip }.
                        </strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div className="vertical-center" style={{minHeight:0, paddingLeft:'5px'}}>
                            <Spinner animation="grow" variant="info" />  
                            <span style={{marginLeft:'10px'}}>
                                { this.state.message }
                            </span>
                        </div>
                    </Toast.Body>
                </Toast>
                { this.getBtn() }
                <Modal show={this.state.showModal} onHide={this.hideModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Scan Ports of { this.state.ip }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label>Ports To Scan</Form.Label>
                            <br></br>
                            <Row>
                                { this.state.scanPort.map((obj, index) => {
                                    return (
                                        <Col key={ obj.id } sm={ 3 } style={{ marginBottom:'5px' }}>
                                            <InputGroup>
                                                <Form.Control type="number" value={ obj.value } min="0" max="65535" onChange={
                                                    (e) => {
                                                        scanPort[index].value = e.target.value;
                            
                                                        this.setState({
                                                            ...this.state,
                                                            scanPort
                                                        })
                                                    }
                                                } placeholder="Port" />
                                                <InputGroup.Append>
                                                    <Button variant="danger" onClick={ () => this.removePort(index) } disabled={ this.state.scanPort.length === 1 ? true : false }> X </Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Col>
                                    )
                                })}
                            </Row>
                            <Button size="sm" variant="outline-primary" onClick={() => {
                                scanPort.push({ id:uuid4(), value:'' })
                                this.setState({...this.state, scanPort});
                            }}> + </Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" type="button" onClick={ this.runPortScan }>
                            Scan
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    data:state.data,
    active:state.activeProcess
})

const reduxActions = {
    scanNetwork,
    setActiveProcess,
    removeActiveProcess
}

export default connect(mapStateToProps, reduxActions)(Ports)