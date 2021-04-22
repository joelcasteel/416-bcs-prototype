import React, {Component, Fragment} from 'react';
import { Redirect } from 'react-router';
import Select from 'react-select';

import PaymentBar from '../payment';

import styles from './eventpage.module.css';

let testEvents = require('../../testEvents.json').events;

class EventPage extends Component {

    constructor() {
        super();
        let pathname = window.location.pathname.slice(7);
        console.log(pathname);

        this.state = {
            pathname: pathname,

            currentEvent: null,
            eventLoaded: false,

            paymentRequired: false,
            pmt: "",
            

            payment: null,
            paymentProvided: "",
            paymentLoaded: false,
            paymentOptions: null,

            cardNum: "",
            cardName: "",
            expirMonth: 1,
            expirYear: 2021,

            error: null,
            message: "",
            registered: false,
        }
    }

    checkRegistered() {
        let username = sessionStorage.getItem("username");

            for(let i in this.state.currentEvent.regs) {
                let reg = this.state.currentEvent.regs[i];
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
                '/api/event/' + this.state.pathname,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
            });
            console.log(response);

            let event = await response.json();

            console.log(event);


            this.setState({
                eventLoaded: true,
                currentEvent: event
            });

            this.checkPmtReq();

        if(this.props.loggedIn) {
            console.log("HELLO");
            let username = sessionStorage.getItem("username");
            for(let i in event.regs) {
                let reg = event.regs[i];
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
        if(this.state.currentEvent.cost > 0) {
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

    onRegisterSubmit = async (event) => {
        try {
            if(this.state.payment !== null || !this.state.paymentRequired){
                let pmt = "";
                if(this.state.payment !== null ) {
                    pmt = this.state.payment;
                }
                let token = window.sessionStorage.getItem('token');
                let response = await fetch('/api/reg', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':'Bearer ' + token
                    },
                    body: JSON.stringify({
                        eventID: this.state.currentEvent._uuid,
                        cardNumber: pmt
                    })
                });
                if(response.status === 201) {
                    this.setState({
                        message: "Registration added.",
                        registered: true
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
                        <h3>Already Registered for Event</h3>
                        <table className={styles.reg_table}>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Username</b><br/>
                                        {username}
                                    </td>
                                    <td>
                                        <b>Slots Taken</b><br/>
                                        {this.state.currentEvent.count}/{this.state.currentEvent.maxSlots}
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
                        <h2>Register for Event</h2>
                        <table className={styles.reg_table}>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Username</b><br/>
                                        {username}
                                    </td>
                                    <td>
                                        <b>Slots Taken</b><br/>
                                        {this.state.currentEvent.count}/{this.state.currentEvent.maxSlots}
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



    currentEventDisplay = () => {
        return (
            <div className={styles.details_div}>
                <h1>{this.state.currentEvent.title}</h1>
                <table className={styles.details_table}>
                    <thead>
                        <tr>
                            <th key="start">Start Time</th>
                            <th key="end">End Time</th>
                            <th key="attendees">Max Attendees</th>
                            <th key="planner">Planner</th>
                            <th key="cost">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.info}>{new Date(this.state.currentEvent.startDate.toString()).toUTCString()}</td>
                            <td className={styles.info}>{new Date(this.state.currentEvent.endDate.toString()).toUTCString()}</td>
                            <td className={styles.info}>{this.state.currentEvent.maxSlots}</td>
                            <td className={styles.info}>{this.state.currentEvent.planner}</td>
                            <td className={styles.info}>${this.state.currentEvent.cost}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td id={styles.description} colSpan='5'>
                                <b>Description:</b><br/>
                                <p>{this.state.currentEvent.description}</p>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }

    render () {
        if(this.state.eventLoaded && this.state.error === null) {
            return (
                <div>
                    {this.currentEventDisplay()}
                    <br/><br/>
                    {this.registration()}
                </div>
            )
        } else if(this.state.error) {
            return (
                <div>
                    Error fetching event
                </div>
            )
        } else {
            return (
                <div>Loading event details</div>
            )
        }
    }
}

export default EventPage;