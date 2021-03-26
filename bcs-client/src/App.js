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
    nextPage: null
  };


  onLoginSubmit = (username, password) => {
    console.log(username + ":" +password);

    this.setState({
      loggedIn: true,
      username: username
    });
  }

  onRegisterSubmit = (username, password) => {
    console.log(username + ":" +password);
    this.setState({
      loggedIn: true,
      username: username
    });
  }

  onLogoutSubmit = () => {
    this.setState({
      loggedIn: false,
      username: null
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

  componentDidMount() {
    document.title = "Best Community Service";
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
            <Route exact path="/planner" render={() =>
              <Planner addNext={this.addNext} loggedIn={this.state.loggedIn}/>
            }/>
            <Route exact path="/volunteer" render={() =>
              <VolunteerPage addNext={this.addNext} loggedIn={this.state.loggedIn}/>
            }/>
            <Route exact path="/donate" component={DonationPage}/>
            <Route path="/event" component={EventPage}/>
        </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
