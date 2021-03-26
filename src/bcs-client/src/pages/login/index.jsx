import React, {Component} from 'react';
import {Redirect, useHistory} from 'react-router-dom';

import styles from './login.module.css';

class LoginPage extends Component {

    

    state = {
        username: null,
        password: null,
        loggedIn: false,
    }

    onUsernameChange = event => {
        this.setState({
            username: event.target.value
        });
    }

    onPasswordChange = event => {
        this.setState({
            password: event.target.value
        });
    }

    onLoginButton = event => {
        if(this.state.username && this.state.password) {
            this.props.onLoginSubmit(this.state.username, this.state.password);
        }
    }

    onRegisterButton = event => {
        if(this.state.username && this.state.password) {
            this.props.onRegisterSubmit(this.state.username, this.state.password);
        }
    }

    redirectBack = () => {
        let nextPage = this.props.popNext();
            return (
                <Redirect to={nextPage}/>
            )
    }


    render() {
        if(!this.props.loggedIn) {
            return (
                <div>
                    <h1>Login</h1>
                    <div className={styles.logindiv}>
                    <table className={styles.loginfeed}>
                        <tbody>
                            <tr key='username'>
                                <td id={styles.username} colSpan='2'>
                                    <b>Username</b><br/>
                                    <input className={styles.entry} type='text' onChange={this.onUsernameChange}></input>
                                </td>
                            </tr>
                            <tr>
                                <td id={styles.password} colSpan='2'>
                                    <b>Password</b><br/>
                                    <input className={styles.entry} type='password' onChange={this.onPasswordChange}></input>
                                </td>
                            </tr>
                            <tr id={styles.buttonrow}>
                                <td id={styles.login_button_cell}>
                                    <button id={styles.loginbutton} onClick={this.onLoginButton}><b>Login</b></button>
                                </td>
                                <td id={styles.register_button_cell}>
                                    <button id={styles.registerbutton} onClick={this.onRegisterButton}><b>Register</b></button>
                                </td>
                            </tr>
                            
                        </tbody>
                    </table>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {this.redirectBack()}
                </div>
            )
        }
    }
}

export default LoginPage;