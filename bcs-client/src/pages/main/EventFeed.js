import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import styles from './eventfeed.module.css'

class EventFeed extends Component {

    state = {
        eventsLoaded: false,
        events: null,
        error: null
    }

    async componentDidMount() {
        try {
            let response = await fetch(
                '/api/event',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
            });
            console.log(response);

            let events = await response.json();

            console.log(events);

            this.setState({
                eventsLoaded: true,
                events: events
            });

        } catch(error) {
            console.log(error);
            this.setState({
                error:error
            });
        }

    }

    eventLink = (srcEvent) => {
        return <td><Link to={'/event/' + srcEvent._uuid}>{srcEvent.title}</Link></td>
    }

    eventList = () => {
        return this.state.events.map((event, index) => {
            
            let start = new Date(event.startDate.toString());
            let end = new Date(event.endDate.toString());

            return (
                <tr key={index}>
                    {this.eventLink(event)}
                    <td>{start.toUTCString()}</td>
                    <td>{end.toUTCString()}</td>
                </tr>
            )
        });
    }


    render() {
        if(this.state.eventsLoaded && this.state.error === null) {
            return (
                <div className="feedDiv">
                    <table className={styles.eventfeed}>
                        <thead>
                            <tr>
                                <th key='eventName'>Event Name</th>
                                <th key='eventType'>Event Type</th>
                                <th key='startTime'>Start Time</th>
                                <th key='endTime'>End Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.eventList()}
                        </tbody>
                    </table>
                </div>
            )
        } else if(this.state.error) {
            return (
                <div>Error Loading Events</div>
            );
        } else {
            return (
                <div>Loading Events</div>
            )
        }
    }
}

export default EventFeed;