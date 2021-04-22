import React, {Component, Fragment} from 'react';
import { Redirect } from 'react-router';
import Select from 'react-select';

import PaymentBar from '../payment';

import styles from './servicepage.module.css';

let testEvents = require('../../testEvents.json').events;

class ServicePage extends Component {

    constructor() {
        super();
        let pathname = window.location.pathname.slice(9);
        console.log(pathname);

        this.state = {
            pathname: pathname,

            currentService: null,
            serviceLoaded: false,

            paymentRequired: false,
            pmt: "",

            detail: "",
            detailProvided: "",
            

            payment: null,
            paymentProvided: "",


            error: null,
            message: "",
            registered: false,
        }
    }

    checkRegistered() {
        let username = sessionStorage.getItem("username");

            for(let i in this.state.currentService.regs) {
                let reg = this.state.currentService.regs[i];
                console.log(reg);
                if(reg.username === username) {
                    return true;
                }
            }
            return false;
    }

    async componentDidMount() {
        try {
            let response = await fetch(
                '/api/service/' + this.state.pathname,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
            });
            console.log(response);

            let service = await response.json();

            console.log(service);


            this.setState({
                serviceLoaded: true,
                currentService: service
            });

            this.checkPmtReq();

        if(this.props.loggedIn) {
            console.log("HELLO");
            let username = sessionStorage.getItem("username");
            for(let i in service.regs) {
                let reg = service.regs[i];
                console.log(reg);
                if(reg.username === username) {
                    let card = "";
                    if(reg.cardNum !== null) {
                        card = reg.cardNum.slice(0,4) + " **** **** ****";
                    }
                    this.setState({
                        registered: true,
                        paymentProvided: card
                    });
                }
            }

        }

        } catch(error) {
            console.log(error);
            this.setState({
                error:error
            });
        }
    }

    onPaymentSelect = (pmt) =>  {
        let cNum = pmt.value.cardNum.repeat(1);
        this.setState({
            payment: cNum
        });
    }


    checkPmtReq() {
        if(this.state.currentService.cost > 0) {
            this.setState({
                paymentRequired: true
            });
        }
    }

    pmtChooser = () => {
        if(this.state.paymentRequired) {
            return <PaymentBar onPaymentSelect={this.onPaymentSelect}/>
        }
        return ""
    }

    onDetailUpdate = event => {
        this.setState({
            detail: event.target.value
        });
    }

    onRegisterSubmit = async (event) => {
        try {
            console.log(this.state.payment);
            if(this.state.payment !== null || !this.state.paymentRequired){
                let token = window.sessionStorage.getItem('token');
                let response = await fetch('/api/sub', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':'Bearer ' + token
                    },
                    body: JSON.stringify({
                        serviceID: this.state.currentService._uuid,
                        cardNumber: this.state.payment,
                        detail: this.state.detail,
                    })
                });
                console.log(response);
                if(response.status === 201) {
                    this.setState({
                        message: "Registration added.",
                        registered: true,
                        detailProvided: this.state.detail
                    })
                }
            } else if(this.state.paymentRequired) {
                this.setState({
                    message: "Payment Required.",
                })
            }
        } catch(error) {
            console.log(error);
            this.setState({
                message: "Error saving registration"
            });
        }
    }

    registration = () => {
        let pmtReq = "No";
        if(this.state.paymentRequired) {
            pmtReq = "Yes";
        }


        if(this.props.loggedIn) {
            let username = sessionStorage.getItem("username");


            if(this.state.registered) {
                return (
                    <div>
                        <h3>Registered for Service</h3>
                        <table className={styles.reg_table}>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Username</b><br/>
                                        {username}
                                    </td>
                                    <td>
                                        <b>Note</b><br/>
                                        {this.state.detailProvided}
                                    </td>
                                    <td>
                                        <b>Payment Provided</b><br/>
                                        {this.state.paymentProvided}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            } else {

                return (
                    <div className={styles.reg_div}>
                        <h2>Register for Service</h2>
                        <table className={styles.reg_table}>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Username</b><br/>
                                        {username}
                                    </td>
                                    <td>
                                        <b>Note</b><br/>
                                        <textarea width="64" height="3" className={styles.detail_entry} value={this.state.detail} onChange={this.onDetailUpdate}/>
                                    </td>
                                    <td>
                                        <b>Payment Required</b><br/>
                                        {pmtReq}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {this.pmtChooser()}
                        <br/>
                        <p>{this.state.message}</p>
                        <br/>
                        <button onClick={this.onRegisterSubmit}>Register</button><br/><br/>
                    </div>
                )
            }
        } else {
            return (
                <div>
                    <h3>Login to Register</h3>
                </div>
            )
        }
    }



    currentServiceDisplay = () => {
        return (
            <div className={styles.details_div}>
                <h1>{this.state.currentService.title}</h1>
                <table className={styles.details_table}>
                    <thead>
                        <tr>
                            <th key="type">Service Type</th>
                            <th key="cost">Cost</th>
                            <th key="costPeriod">Cost Period</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr> 
                            <td className={styles.info}>{this.state.currentService.type}</td>
                            <td className={styles.info}>${this.state.currentService.cost}</td>
                            <td className={styles.info}>{this.state.currentService.costPeriod}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td id={styles.description} colSpan='3'>
                                <b>Description:</b><br/>
                                <p>{this.state.currentService.description}</p>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }

    render () {
        if(this.state.serviceLoaded && this.state.error === null) {
            return (
                <div>
                    {this.currentServiceDisplay()}
                    <br/><br/>
                    {this.registration()}
                </div>
            )
        } else if(this.state.error) {
            return (
                <div>
                    Error fetching service
                </div>
            )
        } else {
            return (
                <div>Loading service details</div>
            )
        }
    }
}

export default ServicePage;