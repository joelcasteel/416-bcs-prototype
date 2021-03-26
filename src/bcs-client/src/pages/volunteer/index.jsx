import React, {Component} from 'react';

import {Redirect} from 'react-router-dom';

import styles from './volunteer.module.css';
let testEvents = require('../../testEvents.json');


let current = [
    [testEvents['public'][0], "Approved"],
    [testEvents['public'][1], "Pending"]
];

let upcoming = [
    testEvents['public'][2],
    testEvents['public'][3]
];

class VolunteerPage extends Component {


    currentList = () => {
        return current.map((oppName, i) => {
            console.log(oppName)
            let opp = testEvents.events[oppName[0]];
            return (
                <tr key={i}>
                    <td>{opp.name}</td>
                    <td colSpan='2'>{opp.volunteerNeeds}</td>
                    <td>{oppName[1]}</td>
                    <td>{opp.startTime}</td>
                    <td>{opp.endTime}</td>
                    <td>{opp.totalSlots}</td>
                    <td>{opp.remainingSlots}</td>
                    <td><button>Remove Application</button></td>
                </tr>
            )
        })
    }

    upcomingList = () => {
        return upcoming.map((oppName, i) => {
            let opp = testEvents.events[oppName];
            return(
                <tr key={i}>
                    <td>{opp.name}</td>
                    <td colSpan='2'>{opp.volunteerNeeds}</td>
                    <td>{opp.startTime}</td>
                    <td>{opp.endTime}</td>
                    <td>{opp.totalSlots}</td>
                    <td>{opp.remainingSlots}</td>
                    <td><button>Submit Application</button></td>
                </tr>
            )
        })
    }

    redirectLogin = () => {
        this.props.addNext('/volunteer');
        return <Redirect to='/login'/>
    }

    render() {
        if(this.props.loggedIn) {
            return (
                <div>
                    <div className={styles.volunteer_div}>
                        <h3>Current Volunteering Applications</h3>
                        <table className={styles.volunteer_list}>
                            <thead>
                                <tr>
                                    <th key='eventName'>Name</th>
                                    <th key='eventNeeds' colSpan='2'>Volunteer Needs Description</th>
                                    <th key='approval'>Approval Status</th>
                                    <th key='startTime'>Start Time</th>
                                    <th key='endTime'>End Time</th>
                                    <th key='totalSlots'>Total Slots</th>
                                    <th key='remainingSlots'>Remaining Slots</th>
                                    <th key='button'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.currentList()}
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    <br/>
                    <div className={styles.volunteer_div}>
                        <h3>Upcoming Opportunities</h3>
                        <table className={styles.volunteer_list}>
                            <thead>
                                <tr>
                                    <th key='eventName'>Name</th>
                                    <th key='eventNeeds' colSpan='2'>Volunteer Needs Description</th>
                                    <th key='startTime'>Start Time</th>
                                    <th key='endTime'>End Time</th>
                                    <th key='totalSlots'>Total Slots</th>
                                    <th key='remainingSlots'>Remaining Slots</th>
                                    <th key='button'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.upcomingList()}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            } else {
            return(
                <div>
                    {this.redirectLogin()}
                </div>
            )
        }
    }
}

export default VolunteerPage;