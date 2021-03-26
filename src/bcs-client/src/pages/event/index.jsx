import React, {Component, Fragment} from 'react';
import { Redirect } from 'react-router';

import styles from './loginpage.module.css';

let testEvents = [
    {
        name: "Boa-Constrictor Live Strangling Demonstration (Ages 3+)",
        type: "Community",
        startTime: "2021-03-31 15:30:00",
        endTime: "2021-03-31 16:30:00",
        description: "Live swallowing of a baby deer.",
        participants: 45,
        planner: "Joe Dangerous"
    },
    {
        name: "Bill and Ted's Excellent Wedding",
        type: "Private",
        startTime: "2021-05-31 18:00:00",
        endTime: "2021-05-31 24:00:00",
        participants: "40",
        description: "A wonderful union for two awesome dudes.",
        planner: "Abroham Lincoln"

    }
];

class EventPage extends Component {

    constructor() {
        super();
        let pathname = window.location.pathname.slice(7).replace(/%20/g, " ");
        let currentEvent = null;
        for (let i in testEvents) {
            if (testEvents[i].name === pathname) {
                currentEvent = testEvents[i];
            }
        }

        this.state = {
            pathname: pathname,
            currentEvent: currentEvent
        }
    }


    currentEventDisplay = () => {
        return (
            <div className={styles.details_div}>
                <h1>{this.state.pathname}</h1>
                <table className={styles.details_table}>
                    <thead>
                        <tr>
                            <th key="start">Start Time</th>
                            <th key="end">End Time</th>
                            <th key="attendees">Max Attendees</th>
                            <th key="planner">Event Planner</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.info}>{new Date(this.state.currentEvent.startTime).toUTCString()}</td>
                            <td className={styles.info}>{new Date(this.state.currentEvent.endTime).toUTCString()}</td>
                            <td className={styles.info}>{this.state.currentEvent.participants}</td>
                            <td className={styles.info}>{this.state.currentEvent.planner}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td id={styles.description} colSpan='4'>
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
        if(this.state.currentEvent.type !== 'Private') {
            return (
                <div>
                    {this.currentEventDisplay()}
                </div>
            )
        } else {
            return <Redirect to='/'/>
        }
    }
}

export default EventPage;