# Best Community Service Prototype

Built for the SER416 final deliverable.

This application is a prototype for a community service website. The service center provides free and paid events and services which can be requested by a user with an account. Public features like donations and the main event scedule do not require an account.

## Tech Stack

### Backend

The system uses NodeJS to serve both files and data to client requests. The server supports a RESTful API for events, services, and registrations. Authentication is done via JSON Web Tokens that will expire after 30 minutes. Two distinct roles are supported by this system: User and Admin.

### Frontend

The client app is built with the ReactJS framework. I use a component router to provide access to pieces of the system at different pages. The main application wrapper also checks the users token to determine whether someone should be routed to a login page before proceeding. 

### Database

Data objects are stored in MongoDB which is a document-based DBMS. Items like user registrations are stored heirarchically under the events/services to which they belong. Database access is managed with the Mongoose package found on the npm repository. This package gives me an easy way to write asyncronous access code that will not bottleneck performance when multiple requests are being made concurrently.

### Authentication

As mentioned before, the server uses JSON Web Tokens based on the RFC-7519 standard. These tokens are cryptographically signed by the server with a predetermined timeout. Tokens are sent to a client upon successful login and are subsequenty put in session storage. The token is put in the Authorization header of any API call sent to the server. The tokens also hold important user information such as the user's name/access permissions. This extra data allows the client to decide what pages should be shown to a user. Note that even if the client gave a user incorrect access to the page, the API would render it non-functional due to a permission level violation.
