import React, {Component, Fragment} from 'react';
import { Redirect } from 'react-router';

import styles from './loginpage.module.css';

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
            error: null
        }
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

        } catch(error) {
            console.log(error);
            this.setState({
                error:error
            });
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
                            <th key="planner">Event Planner</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.info}>{new Date(this.state.currentEvent.startTime).toUTCString()}</td>
                            <td className={styles.info}>{new Date(this.state.currentEvent.endTime).toUTCString()}</td>
                            <td className={styles.info}>{this.state.currentEvent.maxSlots}</td>
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
        if(this.state.eventLoaded && this.state.error === null) {
            return (
                <div>
                    {this.currentEventDisplay()}
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