import React, {Component, Fragment} from 'react';
import { Redirect} from 'react-router';
import {Link} from 'react-router-dom';

import'./navbar.css';

class NavBar extends Component {

    state = {
        loggedIn: this.props.loggedIn,
        isAdmin: this.props.role === "admin"
    }

    onLogoutclick = event => {
        this.props.onLogoutSubmit();
    };


    loginText = () => {
        if(!this.props.loggedIn) {
            return <Link to="/login"><b>Login/Register</b></Link>;
            
        }

        return <Fragment>Welcome, {this.props.username}. <Link onClick={this.onLogoutclick} to='/'><b>Logout</b></Link></Fragment>;
    };



    render() {
        return (
            <div>
                <table className='navbar'>
                    <tbody>
                        <tr>
                            <td className='logo' key='logo'><b>Best Community Service</b></td>
                            <td key='pad0'></td>
                            <td key='home'><Link to="/"><b>Home</b></Link></td>
                            {this.props.role === "admin" &&
                                <td key='planner'><Link to="/planner"><b>Event Planner</b></Link></td>
                                
                            }
                            <td key='donate'><Link to="/donate"><b>Donate</b></Link></td>
                            <td key='pad1'></td>
                            <td className='login' key='login'>{this.loginText()}</td>
                            
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default NavBar;