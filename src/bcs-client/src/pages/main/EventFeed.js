import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import styles from './eventfeed.module.css'

const testEvents = [
    {
        name: "Boa-Constrictor Live Strangling Demonstration (Ages 3+)",
        type: "Community",
        startTime: "2021-03-31 15:30:00",
        endTime: "2021-03-31 16:30:00"
    },
    {
        name: "Bill and Ted's Excellent Wedding",
        type: "Private",
        startTime: "2021-05-31 18:00:00",
        endTime: "2021-05-31 24:00:00"
    }
]

class EventFeed extends Component {

    eventLink = (srcEvent) => {
        if(srcEvent.type !== 'Private') {
            return <td><Link to={'/event/' + srcEvent.name}>{srcEvent.name}</Link></td>
        } else {
            return <td>{srcEvent.name}</td>
        }
    }

    eventList = () => {
        return testEvents.map((testEvent, index) => (
            <tr key={index}>
                {this.eventLink(testEvent)}
                <td>{testEvent.type}</td>
                <td>{new Date(testEvent.startTime).toUTCString()}</td>
                <td>{new Date(testEvent.endTime).toUTCString()}</td>
            </tr>
        ));
    }


    render() {
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
    }
}

export default EventFeed;