import React, { Component } from 'react';
import { Button, Form, Table, OverlayTrigger, Popover, Modal, InputGroup, Toast, Row, Col, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { v4 as uuid4 } from 'uuid';
import swal from 'sweetalert';

import { scanNetwork, setModeNull, setActiveProcess, removeActiveProcess } from '../actions';

import Head from '../components/Head';

import '../assets/css/others.css';

const { ipcRenderer } = window.require('electron');

const defaultOSState = {
    message:"Initiating OS Fingerprinting ...",
    value:"---",
    showToast:false
}
const defaultPortState = {
    message:"Initiating Port Scanning ...",
    value:"---",
    scanPort: [
        {
            id:uuid4(),
            value:''
        }
    ],
    showModal:false,
    showToast:false
}
const defaultBannerState = {
    message:"Initiating Banner Grabbing ...",
    value:"---",
    port:"",
    payload:"",
    showModal:false,
    showToast:false
}

class Others extends Component {
    constructor(props) {
        super(props);

        this.state = {
            targer:"",
            os:defaultOSState,
            port:defaultPortState,
            banner:defaultBannerState,
            bannerValueModal:false
        }
    }

    disableBtn = () => {
        if (this.props.active) {
            return true;
        } else if (!this.state.target) {
            return true;
        } else {
            return false;
        }
    }

    updateTarget = (e) => {
        this.setState({ ...this.state, target:e.target.value });
    } 

    updateBannerPort = (e) => {
        let { banner } = this.state;
        banner.port = e.target.value;

        this.setState({ ...this.state, banner });
    }

    updateBannerPayload = (e) => {
        let { banner } = this.state;
        banner.payload = e.target.value;

        this.setState({ ...this.state, banner });
    }

    showPortModal = () => {
        let { port } = this.state;
        port.showModal = true;
        
        this.setState({ ...this.state, port });
    }
    
    hidePortModal = () => {
        let { port } = this.state;
        port.showModal = false;

        this.setState({ ...this.state, port });
    }

    showBannerModal = () => {
        let { banner } = this.state;
        banner.showModal = true;
        
        this.setState({ ...this.state, banner });
    }
    
    hideBannerModal = () => {
        let { banner } = this.state;
        banner.showModal = false;

        this.setState({ ...this.state, banner });
    }

    showBannerValueModal = () => {
        this.setState({ ...this.state, bannerValueModal:true });
    }
    
    hideBannerValueModal = () => {
        this.setState({ ...this.state, bannerValueModal:false });
    }

    getAllOpenPorts(hostPorts) {
        let ports = hostPorts.map((port, index, arr) => {
            if (index === (arr.length - 1)) {
                return `${port}`;
            } else {
                return `${port}, `;
            }
        });

        return ports;
    }

    runPortScan = (defaultScan) => {
        var { target } = this.state;
        var { scanPort } = this.state.port;

        var proceed = true;
        var allPorts;

        var port = {
            ...this.state.port,
            showToast:true,
            showModal:false
        }

        this.setState({...this.state, port}, () => this.props.setActiveProcess());   

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
            ipcRenderer.send('PORT', [target, allPorts]);
            ipcRenderer.on('PORT', (e, resp) => {
                if(resp.indexOf("Probing") === -1) {
                    let ports = JSON.parse(resp);
                    port.message = defaultPortState.message;

                    if (ports.length === 0) {
                        port.message = "No Open Ports Found.";
                        this.setState({ ...this.state, port});
            
                        setTimeout(() => {
                            port.showToast = false;
                            port.message = defaultPortState.message;

                            this.setState({ ...this.state, port }, () => this.props.removeActiveProcess());
                        }, 4500);
                    } else {
                        port.value = this.getAllOpenPorts(ports);
                        port.showToast = false;
                        port.message = defaultPortState.message;

                        this.setState({ ...this.state, port }, () => this.props.removeActiveProcess());                        
                    }
            
                    if (this.state.port.scanPort.length === 0) {
                        port.scanPort.push({id:uuid4(),value:''});
                        
                        this.setState({...this.state, port});
                    }                
                } else if (resp === "ERR") {
                    swal({
                        title:"Something went wrong.",
                        text:"Please try again.",
                        icon:"warning"
                    })
                    .then(() => {
                        port.showToast = false;
                        port.showModal = true;
                        port.message = defaultPortState.message;

                        this.setState({ ...this.state, port }, () => this.props.removeActiveProcess());                        
                    });
                } else {
                    port.message = resp;
                    
                    this.setState({...this.state, port});
                }
            })
        } else {
            swal({
                title:"Enter all ports before scanning!",
                icon:"warning"
            })
        } 
    }

    runOsScan = () => {
        var { target } = this.state; 

        var os = {
            ...this.state.os,
            showToast:true,
            message:`Probing ${target}`
        }

        this.setState({ ...this.state, os}, () => this.props.setActiveProcess());      

        ipcRenderer.send('OS', [target]);
        ipcRenderer.on('OS', (e, resp) => {
            if (resp === "ERR") {
                swal({
                    title:"Something went wrong.",
                    text:"Please try again.",
                    icon:"warning"
                })
                .then(() => {
                    os.showToast = false;
                    os.message = defaultOSState.message;

                    this.setState({ ...this.state, os }, () => this.props.removeActiveProcess());            
                });
            } else if (parseInt(resp) === 0) {
                os.message = "Unable to find OS.";
                this.setState({ ...this.state, os});
    
                setTimeout(() => {
                    os.showToast = false;
                    os.message = defaultOSState.message;

                    this.setState({ ...this.state, os }, () => this.props.removeActiveProcess());                    
                }, 4500);
            } else {
                os.showToast = false;
                os.message = defaultOSState.message;
                os.value = resp;

                this.setState({ ...this.state, os }, () => this.props.removeActiveProcess());                
            }
        })
    }

    runBannerGrab = () => {
        let { target } = this.state;
        let { port } = this.state.banner;
        let { payload } = this.state.banner;

        var banner = {
            ...this.state.banner,
            showToast:true,
            showModal:false
        }

        this.setState({ ...this.state, banner}, () => this.props.setActiveProcess());      

        ipcRenderer.send('BANNER', [target, JSON.stringify([payload, port])]);
        ipcRenderer.on('BANNER', (e, resp) => {
            if (resp === "ERR") {
                swal({
                    title:"Something went wrong.",
                    text:"Please try again.",
                    icon:"warning"
                })
                .then(() => {
                    banner.showToast = false;
                    banner.message = defaultBannerState.message;

                    this.setState({ ...this.state, banner }, () => this.props.removeActiveProcess());            
                });
            } else if (resp.indexOf("Grabbing") !== -1) {
                banner.message = resp;
                this.setState({ ...this.state, banner});
            } else if ((resp.indexOf("Unable") !== -1) || (resp.indexOf("None") !== -1)) {
                banner.message = resp.indexOf("Unable") !== -1 ? resp : "Unable to Grab Banner.";
                this.setState({ ...this.state, banner});
    
                setTimeout(() => {
                    banner.showToast = false;
                    banner.message = defaultBannerState.message;

                    this.setState({ ...this.state, banner }, () => this.props.removeActiveProcess());                    
                }, 4500);
            } else {
                banner.showToast = false;
                banner.message = defaultBannerState.message;
                banner.value = resp;

                this.setState({ ...this.state, banner }, () => this.props.removeActiveProcess());                
            }
        })
    }

    getAllActivePorts = () => {
        let ports = this.state.port.scanPort.map((obj, index) => {
            let port = obj.value;

            if (index === (this.state.port.scanPort.length - 1)) {
                return `${port}`;
            } else {
                return `${port}, `;
            }
        });

        return ports
    }

    removePort = (index) => {
        let { port } = this.state;
        
        port.scanPort.splice(index, 1);
        
        this.setState({...this.state, port});
    }

    getBanner = () => {
        let { value } = this.state.banner;

        return value.length > 10 ? `${value.slice(0, 10)} ...` : value;
    }

    render() {
        var { port } = this.state;
        return(
            <React.Fragment>
                <Toast id="osToastBox" show={ this.state.os.showToast } style={{
                    height: '110px',
                    width: '270px',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    borderRadius:'5px',
                    boxShadow: '0px 0px 5px 2px #999'
                }}>
                    <Toast.Header closeButton={false}>
                        <strong className="mr-auto">
                            Fingerprinting OS of {this.state.target}.
                        </strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div className="vertical-center" style={{minHeight:0, paddingLeft:'5px'}}>
                            <Spinner animation="grow" variant="info" />  
                            <span style={{marginLeft:'10px'}}>
                                { this.state.os.message }
                            </span>
                        </div>
                        <small><i>This can take very long time...</i></small>
                    </Toast.Body>
                </Toast>
                <Toast id="portToastBox" show={ this.state.port.showToast } style={{
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
                            Scanning Ports { this.getAllActivePorts() } of { this.state.target }
                        </strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div className="vertical-center" style={{minHeight:0, paddingLeft:'5px'}}>
                            <Spinner animation="grow" variant="info" />  
                            <span style={{marginLeft:'10px'}}>
                                { this.state.port.message }
                            </span>
                        </div>
                    </Toast.Body>
                </Toast>
                <Toast id="bannerToastBox" show={ this.state.banner.showToast } style={{
                    height: '90px',
                    width: '310px',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    borderRadius:'5px',
                    boxShadow: '0px 0px 5px 2px #999'
                }}>
                    <Toast.Header closeButton={false}>
                        <strong className="mr-auto">
                            Banner Grabbing {this.state.target}.
                        </strong>
                    </Toast.Header>
                    <Toast.Body>
                        <div className="vertical-center" style={{minHeight:0, paddingLeft:'5px'}}>
                            <Spinner animation="grow" variant="info" />  
                            <span style={{marginLeft:'10px'}}>
                                { this.state.banner.message }
                            </span>
                        </div>
                    </Toast.Body>
                </Toast>

                <div className="vertical-center">
                    <div className="container">
                        <Head />
                        <hr></hr>
                        <div className="text-center">
                            <Form className="file-import-form">
                                <Form.File label="Import Saved Vision Scan Results To Visualize Them" custom />
                            </Form>
                            <br></br>
                            <h5> OR </h5>
                            <div className="text-center" style={{ marginTop:'20px', padding:'0 10rem' }}>
                                <Form className="target-form">
                                    <Form.Label>Perform following actions on a device.</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Target Host</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control type="text" value={ this.state.target } onChange={ this.updateTarget } placeholder="IP Address or Hostname or Domain Name"></Form.Control>
                                    </InputGroup>
                                </Form>
                                <br></br>
                                <Table responsive hover>
                                    <thead>
                                        <tr>
                                            <th>Operating System</th>
                                            <th>Open Ports</th>
                                            <th>Banner</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{ this.state.os.value }</td>
                                            <td>{ this.state.port.value }</td>
                                            <td>
                                                <span className="clickable" onClick={ this.showBannerValueModal }>
                                                    { this.getBanner() }
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <Button type="button" variant="outline-primary" size="sm" onClick={ this.runOsScan } disabled={ this.disableBtn() }>Fingerprint OS</Button>
                                            </td>
                                            <td>
                                                <Button type="button" variant="outline-primary" size="sm" onClick={ this.showPortModal } disabled={ this.disableBtn() }>Scan Ports</Button> 
                                            </td>
                                            <td>
                                                <Button type="button" variant="outline-primary" size="sm" onClick={ this.showBannerModal } disabled={ this.disableBtn() }>Banner Grab</Button> 
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <hr></hr>
                        <Button type="button" variant="info" onClick={ this.props.setModeNull } disabled={ this.props.active }>Back</Button>
                    </div>
                </div>

                <Modal show={ this.state.bannerValueModal } onHide={ this.hideBannerValueModal } centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Banner of target {this.state.target}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { this.state.banner.value }
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.banner.showModal} onHide={this.hideBannerModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Banner Grabbing for {this.state.target}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>Port</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="number" placeholder="Port To Banner Grab" value={ this.state.banner.port } onChange={ this.updateBannerPort }/>
                            </InputGroup>
                            <br></br>
                            <Form.Label>Banner Grabbing Payload</Form.Label>
                            <Form.Control as="textarea" rows="5" value={ this.state.banner.payload } onChange={ this.updateBannerPayload } />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={ this.runBannerGrab } disabled={ this.state.banner.port === "" ? true : false }>Banner Grab</Button>
                    </Modal.Footer>
                </Modal>
                
                <Modal show={this.state.port.showModal} onHide={this.hidePortModal} size="lg" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Scan Ports of { this.state.target }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Label> Ports To Scan </Form.Label>
                            <Button style={{marginLeft:'10px', marginBottom:'6px', padding:'5px'}} size="sm" variant="outline-primary" onClick={() => {
                                port.scanPort.push({ id:uuid4(), value:'' })

                                this.setState({...this.state, port});
                            }}> 
                                <span>
                                    + Add Port
                                </span>
                            </Button> 
                            <br></br>
                            <Row>
                                { this.state.port.scanPort.map((obj, index) => {
                                    return (
                                        <Col key={ obj.id } sm={ 3 } style={{ marginBottom:'5px' }}>
                                            <InputGroup>
                                                <Form.Control type="number" value={ obj.value } min="0" max="65535" onChange={
                                                    (e) => {
                                                        port.scanPort[index].value = e.target.value;
                            
                                                        this.setState({
                                                            ...this.state,
                                                            port
                                                        })
                                                    }
                                                } placeholder="Port" />
                                                <InputGroup.Append>
                                                    <Button variant="danger" onClick={ () => this.removePort(index) } disabled={ this.state.port.scanPort.length === 1 ? true : false }> X </Button>
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
                            port.message = "Scanning well known ports ...";
                            port.scanPort = [];

                            this.setState(
                                {...this.state, port}, 
                                () => this.runPortScan(true)
                            );
                        } }>Scan Well Known Ports</Button>
                        <Button variant="success" type="button" onClick={ () => this.runPortScan(false) }>
                            Scan
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}

const reduxActions = { 
    scanNetwork,
    setModeNull,
    setActiveProcess,
    removeActiveProcess
}

const mapStateToProps = state => ({
    active: state.activeProcess
})

export default connect(mapStateToProps, reduxActions)(Others);