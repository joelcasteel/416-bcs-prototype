import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import styles from './donate.module.css';

class DonationPage extends Component {

    constructor() {
        super();

        this.state = {
            donorName: "",
            email: "",
            amount: 0.00,
            cardNum: "",
            cardName: "",
            expirMonth: 1,
            expirYear: 2021,
            
            donated: false
        }
    }

    onDonorNameUpdate = event => {
        this.setState({
            donorName: event.target.value
        });
    }

    onEmailUdate = event => {
        this.setState({
            email: event.target.value
        });
    }

    onAmountUpdate = event => {
        this.setState({
            amount: event.target.value
        });
    }

    onCardName = event => {
        this.setState({
            cardName: event.target.value
        });
    }

    onCardNumUpdate = event => {
        this.setState({
            cardNum: event.target.value
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

    onSubmitDonation = event => {
        
        this.setState({
            donated: true
        })
    }


    render () {
        if(!this.state.donated) {
            return (
                <div className={styles.donate_div}>
                    <h1>Donations</h1>
                    <p>
                        Here at Best Community Service, we are dedicated to making the most of what we're given.<br/>
                        To make a donation please download, fill out, and upload a donation form.<br/>
                        We'll contact you to complete the process.
                    </p>
                    <table className={styles.donate_table}>
                        <tbody>
                            <tr>
                                <td colSpan="2">
                                    Donor Name <br/>
                                    <input type="text" className={styles.donate_name} value={this.state.donorName} onChange={this.onDonorNameUpdate}></input>
                                </td>
                                <td>
                                    Donor Email <br/>
                                    <input type="text" value={this.state.email} onChange={this.onEmailUdate}/>
                                </td>
                                <td>
                                    Donation Amount <br/>
                                    $<input type="text" value={this.state.amount} onChange={this.onAmountUpdate}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Card Number <br/>
                                    <input type="text" value={this.state.cardNum} onChange={this.onCardNumUpdate}></input>
                                </td>
                                <td>
                                    Cardholder Name <br/>
                                    <input type="text" value={this.state.cardName} onChange={this.onCardName}></input>
                                </td>
                                <td>
                                    Expiration Month
                                    <input type="text" value={this.state.expirMonth} onChange={this.onExpirMonthUpdate}></input>
                                </td>
                                <td>
                                    Expiration Year
                                    <input type="text" value={this.state.expirYear} onChange={this.onExpirYearUpdate}></input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button onClick={this.onSubmitDonation}>Submit Donation</button>
                </div>
            )
        } else {
            return (
                <div>
                    <h2>Donation successful! Thank you for your contribution!</h2>
                    <Link to="/">Return to Homepage</Link>
                </div>
            )
        }
    }
}

export default DonationPage;