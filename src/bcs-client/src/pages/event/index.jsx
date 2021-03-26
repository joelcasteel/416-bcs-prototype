import React, {Component, Fragment} from 'react';
import { Redirect } from 'react-router';

import styles from './loginpage.module.css';

let testEvents = require('../../testEvents.json').events;

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