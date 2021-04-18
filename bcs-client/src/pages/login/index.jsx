import React, {Component} from 'react';
import {Redirect, useHistory} from 'react-router-dom';

import styles from './login.module.css';

class LoginPage extends Component {

    

    state = {
        username: null,
        password: null,
        loggedIn: false,
        error: null
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

    onLoginButton = async (event) => {
        if(this.state.username && this.state.password) {
            try {
                let response = await fetch('/login', {
                    'method': "POST",
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'username': this.state.username,
                        'password': this.state.password
                    })
                });

                if(response.status === 201) {
                    let body = await response.json();
                    sessionStorage.setItem("token", body.token);
                    let token = {};

                    token.header = JSON.parse(window.atob(body.token.split('.')[0]));
                    token.payload = JSON.parse(window.atob(body.token.split('.')[1]));

                    sessionStorage.setItem("username", token.payload.username);
                    sessionStorage.setItem("role", token.payload.role);

                    this.props.onLoginSubmit(token.payload.username, token.payload.role);
                }

            } catch(error) {
                console.log(error);
                this.setState({
                    error: error
                });

            }
        }
    }

    onRegisterButton = async (event) => {
        if(this.state.username && this.state.password) {
            try {
                let response = await fetch('/register', {
                    'method': "POST",
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': JSON.stringify({
                        'username': this.state.username,
                        'password': this.state.password
                    })
                });

                if(response.status === 201) {
                    let body = await response.json();
                    sessionStorage.setItem("token", body.token);

                    let token = {}

                    token.header = JSON.parse(window.atob(body.token.split('.')[0]));
                    token.payload = JSON.parse(window.atob(body.token.split('.')[1]));

                    sessionStorage.setItem("username", token.payload.username);
                    sessionStorage.setItem("role", token.payload.role);

                    this.props.onRegisterSubmit(token.payload.username, token.payload.role);
                }

            } catch(error) {
                console.log(error);
                this.setState({
                    error: error
                });

            }
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