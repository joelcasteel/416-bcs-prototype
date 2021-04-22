import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import styles from './planner.module.css';

const testEvents = require('../../testEvents.json');

class Planner extends Component {

    state = {
        name: '',
        start: '',
        end: '',
        participants: 0,
        services: '',
        description: '',

        eventsLoaded: false,
        events: null,
        error: null,

        currentEvent: null,

        message: ""
    }

    async getEvents() {
        this.setState({
            events: null,
            eventsLoaded: false,
            error: null
        });

        try {
            let token = window.sessionStorage.getItem("token");
            let response = await fetch('/api/event', 
            {
                'method': 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer ' + token
                }
            });

            if(response.status === 200) {
                let events = await response.json();
                console.log(events);

                this.setState({
                    events: events,
                    eventsLoaded: true
                });

            }

        } catch(error) {
            console.log(error);
            this.setState({
                error: error
            });

        }
    }

    async componentDidMount() {
        this.getEvents();


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

    onSavePressed = async (event) => {

        try {
            let token = window.sessionStorage.getItem("token");
            let response = await fetch('/api/event', 
            {
                'method': 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer ' + token
                },
                body: JSON.stringify({
                    title: this.state.name,
                    startDate: this.state.start,
                    endDate: this.state.end,
                    maxSlots: this.state.participants,
                    cost: this.state.services,
                    description: this.state.description
                })
            });
            console.log(response);
            if(response.status === 201) {
                this.getEvents();

            }

        } catch(error) {
            console.log(error);
            this.setState({
                error: error,
                message: "Error saving event!"
            });

        }



        this.setState({
            name: '',
            start: '',
            end: '',
            participants: 0,
            services: '',
            description: ''
        });
    }

    onClearPressed = event => {
        this.setState({
            name: '',
            startDate: '',
            endDate: '',
            participants: 0,
            services: '',
            description: ''
        });
    }

    onEditClick = function(editEvent) {


        this.setState({
            name: editEvent.title,
            startDate: editEvent.startDate.slice(0,-1),
            endDate: editEvent.endDate.slice(0,-1),
            participants: editEvent.maxSlots,
            services: editEvent.cost,
            description: editEvent.description
        });
    }

    onDeleteClick = async function(deleteEvent) {
        console.log(deleteEvent._uuid);
        try {

            let token = window.sessionStorage.getItem("token");

            let response = await fetch('/api/event/' + deleteEvent._uuid, {
                'method': 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer ' + token
                }
            });
            console.log(response)
            if(response.status === 204) {
                this.getEvents();
                this.setState({
                    message: "Event successfully deleted"
                });
            }

        } catch(error) {
            console.log(error);
            this.setState({
                message: "Error deleting event!"
            });

        }

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
                            <th key='services'>Cost</th>
                            <th key='description'>Description</th>
                            <th key='delete-blank'></th>
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
        return this.state.events.map((event, index) => {
            return (
                <tr key={index}>
                    <td>{event.title}</td>
                    <td>{new Date(event.startDate.toString()).toUTCString()}</td>
                    <td>{new Date(event.endDate.toString()).toUTCString()}</td>
                    <td>{event.maxSlots}</td>
                    <td>{event.cost}</td>
                    <td>{event.description}</td>
                    <td key='delete'><button onClick={() => this.onDeleteClick(event)}>Delete</button></td>
                </tr>
            )
        })
    }

    render() {
        if(this.state.eventsLoaded && this.state.error === null) {
            return (
                <div>
                    <div className={styles.planner_div}>
                        <h3>Create Event</h3>
                        <h4>{this.state.message}</h4>
                        <table className={styles.planner_table}>
                            <tbody>
                                <tr key="event-name">
                                    <td className={styles.entry_prompt}>Event Name</td>
                                    <td colSpan='3'><input id={styles.name} type='text' value={this.state.name} onChange={this.onNameChange}></input></td>
                                </tr>
                                <tr key="event-time">
                                    <td className={styles.entry_prompt}>Start Time</td>
                                    <td><input id={styles.start} type='datetime-local' value={this.state.startDate} onChange={this.onStartTimeChange}></input></td>
                                    <td className={styles.entry_prompt}>End Time</td>
                                    <td><input id={styles.end} type='datetime-local' value={this.state.endDate} onChange={this.onEndTimeChange}></input></td>
                                </tr>
                                <tr key="event-details">
                                    <td className={styles.entry_prompt}>Participants</td>
                                    <td><input id={styles.participants} type='text' pattern='^[0-9]*$' value={this.state.participants} onChange={this.onParticipantsChange}></input></td>
                                    <td className={styles.entry_prompt}>Event Cost</td>
                                    <td>$<input id={styles.services} type='text' value={this.state.services} onChange={this.onServicesChange}></input></td>
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
        } else if(this.state.error) {
            return (
                <div>
                    Error loading Events
                </div>
            );
        } else {
            return (
                <div>
                    Loading events
                </div>
            )
        }
    }
}

export default Planner;