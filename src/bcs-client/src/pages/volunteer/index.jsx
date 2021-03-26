import React, {Component} from 'react';

import {Redirect} from 'react-router-dom';

import styles from './volunteer.module.css';

let current = [
    {
        name: "Boa-Constrictor Live Strangling Demonstration (Ages 3+)",
        volunteerNeeds: "Need volunteers with strong necks who won't be strangled easily. Must be good at pulling kids out of snakes' mouths.",
        approvalStatus: 'Approved',
        startTime: "2021-03-31 15:30:00",
        endTime: "2021-03-31 16:30:00",
        totalSlots: 5,
        remainingSlots: 3
    },
    {
        name: "Flat-Earther Convention",
        volunteerNeeds: "Looking for volunteers with healthy sense of doubt and skepticism. Must not be sheeple.",
        approvalStatus: 'Pending',
        startTime: "2021-04-20 12:00:00",
        endTime: "2021-04-20 22:00:00",
        totalSlots: 10,
        remainingSlots: 9
    },
];

let upcoming = [
    {
        name: "Esports Tournament",
        volunteerNeeds: "Wanted. Volunteers to officiate Super Smash Bros Community Tournament. Must be understand rules and be capable of taking controllers from raging contestants.",
        startTime: "2021-04-10 16:00:00",
        endTime: "2021-04-10 23:30:00",
        totalSlots: 7,
        remainingSlots: 1
    },
    {
        name: "Pottery Night",
        volunteerNeeds: "Accepting application from volunteers who enjoy scultping clay into various shapes. This is NOT a harry potter themed event.",
        startTime: "2021-05-1 18:00:00",
        endTime: "2021-05-2 24:00:00",
        totalSlots: 4,
        remainingSlots: 2
    },
];

class VolunteerPage extends Component {


    currentList = () => {
        return current.map((opp, i) => (
            <tr key={i}>
                <td>{opp.name}</td>
                <td colspan='2'>{opp.volunteerNeeds}</td>
                <td>{opp.approvalStatus}</td>
                <td>{opp.startTime}</td>
                <td>{opp.endTime}</td>
                <td>{opp.totalSlots}</td>
                <td>{opp.remainingSlots}</td>
                <td><button>Remove Application</button></td>
            </tr>
        ))
    }

    upcomingList = () => {
        return upcoming.map((opp, i) => (
            <tr key={i}>
                <td>{opp.name}</td>
                <td colspan='2'>{opp.volunteerNeeds}</td>
                <td>{opp.startTime}</td>
                <td>{opp.endTime}</td>
                <td>{opp.totalSlots}</td>
                <td>{opp.remainingSlots}</td>
                <td><button>Submit Application</button></td>
            </tr>
        ))
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
                                    <th key='eventNeeds' colspan='2'>Volunteer Needs Description</th>
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
                                    <th key='eventNeeds' colspan='2'>Volunteer Needs Description</th>
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