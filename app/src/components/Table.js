import React, { Component } from 'react';
import { Table, Button, Spinner, Toast, Modal, OverlayTrigger, Form, Row, Col, InputGroup, Popover } from 'react-bootstrap';
import { connect } from 'react-redux';
import { v4 as uuid4 } from 'uuid';
import swal from 'sweetalert';

import { scanNetwork, setActiveProcess, removeActiveProcess } from '../actions';

import '../assets/css/table.css';

const { ipcRenderer } = window.require('electron');

const defaultMessage = "";
const defaultScanPortValue = [
    {
        id:uuid4(),
        value:''
    }
];

class TableView extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ip:"",
            os:false,
            scanPort:defaultScanPortValue,
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

    getData() {
        return this.props.data
    }

    updateReduxData(data) {
        this.props.scanNetwork(data);
    }

    cancelOperationOS = () => {
        swal({
            title: "Cancel OS Fingerprinting?",
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
                ipcRenderer.invoke('KILL');
                this.setState({...this.state, os: false, message:defaultMessage }, () => this.props.removeActiveProcess());
            }
        });
    }

    cancelOperationPort = () => {
        swal({
            title: "Cancel Port Scanning?",
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
                ipcRenderer.invoke('KILL');
                this.setState({...this.state, showToast: false, message:defaultMessage, scanPort:defaultScanPortValue }, () => this.props.removeActiveProcess());
            }
        });
    }

    updateOS(os) {
        let data = this.getData();
        let { ip } = this.state

        if (parseInt(os) === 0) {
            this.setState({ ...this.state, message:"Unable to find OS."});

            setTimeout(() => {
                this.setState({ ...this.state, os:false, message:defaultMessage }, () => this.props.removeActiveProcess());                
            }, 4500);
        } else {
            for (let host of data.hosts) {
                if (host.IP === ip) {
                    host.OS = os;
                    break;
                }
            }
    
            this.updateReduxData(data);
            this.setState({ ...this.state, ip:"", os:false }, () => this.props.removeActiveProcess());            
        }
    }

    updatePort(ports) {
        let data = this.props.data;
        let { ip } = this.state;
        

        if (ports.length === 0) {
            this.setState({ ...this.state, message:"No Open Ports Found."});

            setTimeout(() => {
                this.setState({ ...this.state, showToast:false, message:defaultMessage }, () => this.props.removeActiveProcess());                
            }, 4500);
        } else {
            for (let host of data.hosts) {
                if (host.IP === ip) {
                    host.Ports = ports;
                    break;
                }
            }
    
            this.updateReduxData(data);
    
            this.setState({ ...this.state, message:defaultMessage }, () => this.props.removeActiveProcess());            
        }

        if (this.state.scanPort.length === 0) {
            let { scanPort } = this.state;
            scanPort.push({id:uuid4(),value:''});
            this.setState({...this.state, scanPort});
        }
    }

    runOsScan(ip) {
        this.setState({ ...this.state, ip, os:true, message:`Probing IP ${ip}` }, () => this.props.setActiveProcess());    

        ipcRenderer.send('OS', [ip]);
        ipcRenderer.on('OS', (e, resp) => {
            if (resp === "ERR") {
                swal({
                    title:"Something went wrong.",
                    text:"Please try again.",
                    icon:"warning"
                })
                .then(() => this.props.removeActiveProcess());
            } else {
                this.updateOS(resp);
            }
        })
    }

    runPortScan(defaultScan) {
        let { ip } = this.state;
        let { scanPort } = this.state;

        let proceed = true;
        let allPorts;

        if (defaultScan) {
            allPorts = "default";
        } else {
            allPorts = [];

            scanPort.map(obj => {
                if (!obj.value) {
                    proceed = false;
                }
                allPorts.push(obj.value);
                return null;
            });
        }

        if (proceed) {
            this.setState({...this.state, showToast:true, showModal:false}, () => this.props.setActiveProcess());            

            ipcRenderer.send('PORT', [ip, allPorts]);
            ipcRenderer.on('PORT', (e, resp) => {
                if(resp.indexOf("Probing") === -1) {
                    this.setState({...this.state, showToast:false, message:"Complete."}, () => this.updatePort(JSON.parse(resp)));                    
                } else if (resp === "ERR") {
                    swal({
                        title:"Something went wrong.",
                        text:"Please try again.",
                        icon:"warning"
                    })
                    .then(() => this.props.removeActiveProcess());
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

    showModal = (ip) => {
        this.setState({...this.state, showModal:true, ip});
    }
    
    hideModal = () => {
        this.setState({...this.state, showModal:false, ip:""});
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

    getAllOpenPorts = (hostPorts) => {
        let ports = hostPorts.map((port, index, arr) => {
            if (index === (arr.length - 1)) {
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

    
    removePort = (index) => {
        let { scanPort } = this.state;
        
        scanPort.splice(index, 1);
        
        this.setState({...this.state, scanPort});
    }

    disableBtn = () => {
        if ((this.props.active) || (this.props.imported === "IMPORTED")) {
            return true;
        } else {
            return false;
        }
    }
    
    getPortBtn = (host) => {
        let ip = host.IP;
        let ports = host.Ports;

        if (ports.length === 0) {
            return (
                <React.Fragment>
                    <Button id={`btnPort-${ip}`} variant="outline-primary" size="sm" onClick={ () => this.showModal(ip) } disabled={ this.disableBtn() }> 
                        Scan
                    </Button>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    { this.getAllOpenPorts(ports) }
                    <br></br>
                    <Button id={`btnPort-${ip}`} style={{ marginTop:'5px' }} variant="outline-primary" size="sm" onClick={ () => this.showModal(ip) } disabled={ this.disableBtn() }> 
                        Re-Scan
                    </Button>
                </React.Fragment>
            );  
        }
    }
    
    getOSBtn = (host) => { 
        let os = host.OS;
        let ip = host.IP;

        if (os) {
            return (
                <React.Fragment>
                    { os }
                    <Button id={`btnOS-${ip}`} style={{ marginTop:'5px' }} variant="outline-primary" size="sm" onClick={() => { this.runOsScan(ip) }} disabled={ this.disableBtn() }>
                        Re-Scan
                    </Button> 
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    <Button id={`btnOS-${ip}`} variant="outline-primary" size="sm" onClick={() => { this.runOsScan(ip) }} disabled={ this.disableBtn() }>
                        Scan
                    </Button> 
                </React.Fragment>
            );
        }
    }

    render() {
        var { scanPort } = this.state;
        return (
            <React.Fragment>
                <Toast id="osToastBox" show={ this.state.os } onClose={ this.cancelOperationOS }
                style={{
                    height: '110px',
                    width: '270px',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    borderRadius:'5px',
                    boxShadow: '0px 0px 5px 2px #999'
                }}>
                    <Toast.Header>
                        <strong className="mr-auto">
                            Fingerprinting OS.
                        </strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div className="vertical-center" style={{minHeight:0, paddingLeft:'5px'}}>
                            <Spinner animation="grow" variant="info" />  
                            <span style={{marginLeft:'10px'}}>
                                { this.state.message }
                            </span>
                        </div>
                        <small><i>This can take very long time...</i></small>
                    </Toast.Body>
                </Toast>
                <Toast id="portToastBox" show={ this.state.showToast } onClose={ this.cancelOperationPort }
                style={{
                    height: '120px',
                    width: '270px',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    borderRadius:'5px',
                    boxShadow: '0px 0px 5px 2px #999'
                }}>
                    <Toast.Header>
                        <strong className="mr-auto">
                            Scanning Ports { this.getAllActivePorts() } of { this.state.ip }
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
                            { this.getData().hosts.map(host => {
                                return (
                                    <tr key={host.IP}>
                                        <td>{host.IP}</td>
                                        <td>{host.MAC}</td>
                                        <td>{host.Vendor}</td>
                                        <td>{host.Hostname}</td>
                                        <td>
                                            { this.getOSBtn(host) }
                                        </td>
                                        <td>
                                            { this.getPortBtn(host) }
                                        </td>
                                    </tr>
                                );
                            }) }
                        </tbody>
                    </Table>
                </div>

                <Modal show={this.state.showModal} onHide={this.hideModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Scan Ports of { this.state.ip }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label> Ports To Scan </Form.Label>
                            <Button style={{marginLeft:'10px', marginBottom:'6px', padding:'5px'}} size="sm" variant="outline-primary" onClick={() => {
                                scanPort.push({ id:uuid4(), value:'' })
                                this.setState({...this.state, scanPort});
                            }}> 
                                <span>
                                    + Add Port
                                </span>
                            </Button> 
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
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <OverlayTrigger trigger={["hover", "click"]} placement="left" overlay={
                            <Popover id="popover-tip">
                                <Popover.Title as="h3">Don't know which port to scan? Try scanning all well known ports!</Popover.Title>
                                <Popover.Content>
                                    <span>
                                        <small>
                                            <i>
                                                5,7,18,20,21,22,23,25,29,37,42,43,49,53,69,70,79,80,103,108,109,110,115,118,119,137,139,143,150,156,161,179,190,194,197,201,389,396,443,444,445,458,514,546,547,563,569,631,691,1080,1311,1900,3124,3128,3306,5000,5432,11371,65535
                                            </i>
                                        </small>
                                        <br></br>
                                        <br></br>
                                        These are the well known reserved ports used for various purposes in Computer Networking.
                                        Chances are some of the devices in your network are using these ports right now.
                                    </span>
                                </Popover.Content>
                            </Popover>
                        }>
                            <small>Well Known Ports?</small>
                        </OverlayTrigger>
                        <Button variant="outline-success" type="button" onClick={ () => {
                            this.setState(
                                {...this.state, message:"Scanning well known ports ...", scanPort:[]}, 
                                () => this.runPortScan(true)
                            );
                        } }>Scan Well Known Ports</Button>
                        <Button variant="success" type="button" onClick={ () => this.runPortScan(false) }>
                            Scan
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}


const reduxActions = {
    scanNetwork,
    setActiveProcess,
    removeActiveProcess
}

const mapStateToProps = state => ({
    active: state.activeProcess,
    imported: state.scanMode.subMode
})

export default connect(mapStateToProps, reduxActions)(TableView)