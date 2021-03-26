import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import styles from './donate.module.css';

class DonationPage extends Component {
    render () {
        return (
            <div className={styles.donate_div}>
                <h1>Donations</h1>
                <p>
                    Here at Best Community Service, we are dedicated to making the most of what we're given.<br/>
                    To make a donation please download, fill out, and upload a donation form.<br/>
                    We'll contact you to complete the process.
                </p>
                <table className={styles.donate_table}>
                    <thead>
                        <tr>
                            <th><b>Download Donation Forms</b></th>
                            <th><b>Upload Donation Forms</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <Link>BCS_Donation_Form_2021.pdf</Link>
                            </td>
                            <td>
                                <input type='file'/>
                                <br/>
                                <button>Submit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default DonationPage;