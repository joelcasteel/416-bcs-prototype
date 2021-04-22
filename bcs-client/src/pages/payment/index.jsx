import React, {Component, Fragment} from 'react';
import { Redirect } from 'react-router';
import Select from 'react-select';

import styles from './payment.module.css';


class PaymentBar extends Component {

    constructor() {
        super();

        this.state = {
            payment: null,
            paymentLoaded: false,
            paymentOptions: null,

            cardNum: "",
            cardName: "",
            expirMonth: 1,
            expirYear: 2021,
            sending: false,
            error: null,

            message: ""
        }
    }

    async getPayments() {
        try {
            let token = window.sessionStorage.getItem('token');
            let response = await fetch(
                '/api/payment/', 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization':'Bearer ' + token
                    }
            });
            console.log(response);
            let payment = await response.json();
            console.log(payment);

            let pmtOptions = [];

            for(let i in payment) {
                let substring = payment[i].cardNum.toString();
                substring = substring.slice(0,4) + " **** **** ****";
                pmtOptions.push(
                    {
                        value: payment[i],
                        label: substring
                    }
                )

            }

            this.setState({
                paymentLoaded: true,
                payment: payment,
                paymentOptions: pmtOptions
            });

        } catch(error) {
            console.log(error);
            this.setState({error:error});
        }
    }

    async componentDidMount() {
        this.getPayments();
    }


    onCardNumberUpdate = event => {
        this.setState({
            cardNum: event.target.value
        });
    }

    onCardNameUpdate = event => {
        this.setState({
            cardName: event.target.value
        });
    }

    onExpirMonthUpdate = event => {
        this.setState({
            expirMonth: event.target.value
        });
    }

    onExpirYearUpdate = event => {
        this.setState({
            expirYear: event.target.value
        });
    }

    onPaymentSubmit = async(event) => {
        this.setState({sending: true});
        let pmt = {
            'cardNum': this.state.cardNum,
            'name': this.state.cardName,
            'expirMonth': parseInt(this.state.expirMonth),
            'expirYear': parseInt(this.state.expirYear)
        };

        try {
            let token = window.sessionStorage.getItem('token');
            let response = await fetch('/api/payment/',
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer ' + token
                },
                body: JSON.stringify(pmt)
            });

            if(response.status === 201) {
                this.getPayments();
                this.setState({
                    message: "Payment saved successfully"
                });

            }

        } catch (error) {
            console.log(error);
            this.setState({
                error: error,
                message: "Error saving payment"
            });
        }
    }

    onPaymentSelect = pmt => {
        this.props.onPaymentSelect(pmt);
    }

    render() {
        return (
            <table className={styles.payment_table}> 
                <tbody>
                    <tr>
                        <td colSpan="1">
                            <h3>Select Payment</h3><br/>
                            <Select 
                                options={this.state.paymentOptions}
                                isSearchable={true}
                                onChange={this.onPaymentSelect}
                            />
                        </td>
                        <td colSpan="1" className={styles.new_payment}>
                            <h3>Add New Payment Method</h3>

                            <p>{this.state.message}</p>

                            <b>Card Number</b><br/>
                            <input type="text" onChange={this.onCardNumberUpdate} value={this.state.cardNum}></input><br/><br/>

                            <b>Cardholder Name</b><br/>
                            <input type="text" onChange={this.onCardNameUpdate} value={this.state.cardName}></input><br/><br/>

                            <b>Expiration Month</b><br/>
                            <input type="number" min="1" max="12" onChange={this.onExpirMonthUpdate} value={this.state.expirMonth}></input><br/><br/>

                            <b>Expiration Year</b><br/>
                            <input type="number" min="2021" max="2050" onChange={this.onExpirYearUpdate} value={this.state.expirYear}></input><br/><br/>
                            <button onClick={this.onPaymentSubmit}>Save Payment</button>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
    );
    }
}

export default PaymentBar;