import React from 'react';

import EventFeed from './EventFeed';
import ServiceFeed from './ServiceFeed';

const MainPage = () => (
    <div>
        <br/><br/>
        <h1>Best Community Service</h1>
        <p>
            Best Community Service is dedicated to making an impact locally through our many events
            and volunteering opportunities.
        </p>
        <br/><br/>
        <h2>Event Schedule</h2>
        <EventFeed/>
        <br/>
        <br/>
        <h2>Services Provided</h2>
        <ServiceFeed/>
    </div>
)

export default MainPage;