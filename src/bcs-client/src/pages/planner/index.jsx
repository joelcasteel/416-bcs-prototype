import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import styles from './planner.module.css';

const testEvents = [
    {
        name: "Bill and Ted's Excellent Wedding",
        start: "2021-05-31T18:00:00",
        end: "2021-05-31T24:00:00",
        participants: "40",
        services: "Catering, DJ set, MC",
        description: "A wonderful union for two awesome dudes."
    },

    {
        name: "CS:GO LAN Party",
        start: "2021-06-29 18:00:00",
        end: "2021-06-30 8:00:00",
        participants: "15",
        services: "Internet, Tables, Chairs",
        description: "Couple'a guys bein' dudes."
    },

];

class Planner extends Component {

    state = {
        name: '',
        start: '',
        end: '',
        participants: 0,
        services: '',
        description: '',

        currentEvent: null
    }

    onNameChange = event => {
        this.setState({
            name: event.target.value
        });
    }

    onStartTimeChange = event => {
        this.setState({
            start: event.target.value
        });
    }
    
    onEndTimeChange = event => {
        this.setState({
            end: event.target.value
        });
    }

    onParticipantsChange = event => {
        this.setState({
            participants: event.target.value
        });
    }

    onServicesChange = event => {
        this.setState({
            services: event.target.value
        });
    }

    onDescriptionChange = event => {
        this.setState({
            description: event.target.value
        });
    }

    onSavePressed = event => {
        let newEvent = {
            name: this.state.name,
            start: new Date(this.state.start),
            end: new Date(this.state.end),
            participants: this.state.participants,
            services: this.state.services,
            description: this.state.description
        };

        this.setState({
            name: '',
            start: '',
            end: '',
            participants: 0,
            services: '',
            description: '',

            currentEvent: newEvent
        });
    }

    onClearPressed = event => {
        this.setState({
            name: '',
            start: '',
            end: '',
            participants: 0,
            services: '',
            description: ''
        });
    }

    redirectLogin = () => {
        this.props.addNext('/planner');
        return <Redirect to='/login'/>
    }

    onEditClick = function(editEvent) {


        this.setState({
            name: editEvent.name,
            start: editEvent.start,
            end: editEvent.start,
            participants: editEvent.participants,
            services: editEvent.services,
            description: editEvent.description
        });
    }

    eventTable = () => {
        return (
            <div className={styles.feed_div}>
                <table className={styles.event_feed}>
                <thead>
                        <tr>
                            <th key='eventName'>Event Name</th>
                            <th key='start'>Start Time</th>
                            <th key='end'>End Time</th>
                            <th key='participants'>Participants</th>
                            <th key='services'>Services</th>
                            <th key='description'>Description</th>
                            <th key='edit-blank'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.eventFeed()}
                    </tbody>
                </table>
            </div>

        )
    }

    eventFeed = () => {
        return testEvents.map((testEvent, index) => (
            <tr key={index}>
                <td>{testEvent.name}</td>
                <td>{new Date(testEvent.start).toUTCString()}</td>
                <td>{new Date(testEvent.end).toUTCString()}</td>
                <td>{testEvent.participants}</td>
                <td>{testEvent.services}</td>
                <td>{testEvent.description}</td>
                <td key='edit'><button onClick={() => this.onEditClick(testEvent)}>Edit</button></td>
            </tr>
        ))
    }

    render() {
        if(this.props.loggedIn) {
            return (
                <div>
                    <div className={styles.planner_div}>
                        <h3>Create Event</h3>
                        <table className={styles.planner_table}>
                            <tbody>
                                <tr key="event-name">
                                    <td className={styles.entry_prompt}>Event Name</td>
                                    <td colSpan='3'><input id={styles.name} type='text' value={this.state.name} onChange={this.onNameChange}></input></td>
                                </tr>
                                <tr key="event-time">
                                    <td className={styles.entry_prompt}>Start Time</td>
                                    <td><input id={styles.start} type='datetime-local' value={this.state.start} onChange={this.onStartTimeChange}></input></td>
                                    <td className={styles.entry_prompt}>End Time</td>
                                    <td><input id={styles.end} type='datetime-local' value={this.state.end} onChange={this.onEndTimeChange}></input></td>
                                </tr>
                                <tr key="event-details">
                                    <td className={styles.entry_prompt}>Participants</td>
                                    <td><input id={styles.participants} type='text' pattern='^[0-9]*$' value={this.state.participants} onChange={this.onParticipantsChange}></input></td>
                                    <td className={styles.entry_prompt}>Additional Services Requested</td>
                                    <td><input id={styles.services} type='text' value={this.state.services} onChange={this.onServicesChange}></input></td>
                                </tr>
                                <tr key="event-description">
                                    <td className={styles.entry_prompt}>Description</td>
                                    <td colSpan='3'><textarea id={styles.description} value={this.state.description} onChange={this.onDescriptionChange}></textarea></td>
                                    
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className={styles.control_cell} colSpan='2'>
                                        <button onClick={this.onSavePressed}>
                                            Save Event
                                        </button>
                                    </td>
                                    <td className={styles.control_cell} colSpan='2'>
                                    <button onClick={this.onClearPressed}>
                                            Clear Event
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div>
                        <h3>Planned Events</h3>
                        <div>
                            {this.eventTable()}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {this.redirectLogin()}
                </div>
            )
        }
    }
}

export default Planner;