import React, {Component, Fragment} from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  useHistory
} from 'react-router-dom';

import MainPage from './pages/main';
import NavBar from './pages/NavBar';
import LoginPage from './pages/login';
import Planner from './pages/planner';
import EventPage from './pages/event';
import DonationPage from './pages/donate';
import VolunteerPage from './pages/volunteer';
import ServicePage from './pages/services';

/**
 * This is the router class for the entire project.
 * 
 * Routes are added with the following tag structure:
 * 
 * <Route path="{Path_in_browser}" component={Imported_Component}/>
 * 
 * Router code help credits go to this article by Islem Maboud:
 * https://bit.ly/2O5x1Oz
 * 
 */
class App extends Component {
  state = {
    loggedIn: false,
    username: null,
    role: null,
    nextPage: null
  };


  onLoginSubmit = (username, role) => {
    console.log(username + ":" +role);

    this.setState({
      loggedIn: true,
      username: username,
      role: role,
    });
  }

  onRegisterSubmit = (username, role) => {
    console.log(username + ":" +role);
    this.setState({
      loggedIn: true,
      username: username,
      role: role
    });
  }

  onLogoutSubmit = () => {
    this.setState({
      loggedIn: false,
      username: null,
      role: null
    });
  }

  addNext = (page) => {
    this.setState({
      nextPage: page
    });
  }

  popNext = () => {
    let nextPage = '/'

    if(this.state.nextPage) {
      nextPage = this.state.nextPage;
    }

    this.setState({
      nextPage: null
    });

    return nextPage;
  }

  async componentDidMount() {
    document.title = "Best Community Service";
    try {
      let token = window.sessionStorage.getItem("token");
      let response = await fetch(
        '/api/check/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'Bearer ' + token
            }
    });
    if(response.status === 200) {
      this.setState({
        loggedIn:true,
        username: window.sessionStorage.getItem("username")
      });
    }
    } catch(error) {
      console.log(error);
    }

  }




  render() {
    return (
      <Router>
        <div>
          <NavBar username={this.state.username} loggedIn={this.state.loggedIn} onLogoutSubmit={this.onLogoutSubmit}/>
          <Switch>
            <Route exact path="/" component={MainPage}/>
            <Route exact path="/login" render={() =>
              <LoginPage popNext={this.popNext} loggedIn={this.state.loggedIn} onLoginSubmit={this.onLoginSubmit} onRegisterSubmit={this.onRegisterSubmit}/>}
            />
            <Route exact path="/planner" render={() =>{

              if(this.state.loggedIn) {
                return <Planner addNext={this.addNext} loggedIn={this.state.loggedIn}/>
              } else {
                return <LoginPage popNext={this.popNext} loggedIn={this.state.loggedIn} onLoginSubmit={this.onLoginSubmit} onRegisterSubmit={this.onRegisterSubmit}/>
              }
            }}/>
            <Route exact path="/volunteer" render={() =>
              <VolunteerPage addNext={this.addNext} loggedIn={this.state.loggedIn}/>
            }/>
            <Route exact path="/donate" component={DonationPage}/>
            <Route path="/event" render={() => 
              <EventPage loggedIn={this.state.loggedIn}/>
            }/>
            <Route path="/service" render={() => 
              <ServicePage loggedIn={this.state.loggedIn}/>
            }/>
        </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
