import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import styles from './eventfeed.module.css'

class ServiceFeed extends Component {

    state = {
        servicesLoaded: false,
        services: null,
        error: null
    }

    async componentDidMount() {
        try {
            let response = await fetch(
                '/api/service',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
            });
            console.log(response);

            let services = await response.json();

            console.log(services);

            this.setState({
                servicesLoaded: true,
                services: services
            });

        } catch(error) {
            console.log(error);
            this.setState({
                error:error
            });
        }

    }

    serviceLink = (srcService) => {
        return <td><Link to={'/service/' + srcService._uuid}>{srcService.title}</Link></td>
    }

    serviceList = () => {
        return this.state.services.map((service, index) => {
            
            

            return (
                <tr key={index}>
                    {this.serviceLink(service)}
                    <td>{service.description}</td>
                    <td>{service.cost}</td>
                    <td>{service.costPeriod}</td>
                </tr>
            )
        });
    }

    render() {
        if(this.state.servicesLoaded && this.state.error === null) {
            return (
                <div className="feedDiv">
                    <table className={styles.eventfeed}>
                        <thead>
                            <tr>
                                <th key='serviceName'>Service Name</th>
                                <th key='serviceDescript'>Service Type</th>
                                <th key='serviceCost'>Service Cost </th>
                                <th key='servicePeriod'>Cost Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.serviceList()}
                        </tbody>
                    </table>
                </div>
            )
        } else if(this.state.error) {
            return (
                <div>Error Loading Services</div>
            );
        } else {
            return (
                <div>Loading services</div>
            )
        }
    }
}

export default ServiceFeed;