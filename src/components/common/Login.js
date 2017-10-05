/**
 * Login Component
 * Uses JWT to authenticate teacher on the website
 */
import React, {Component} from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import {Grid,Row,Col, Alert} from 'react-bootstrap';
import logo from '../../blacklogo.png';



class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            error: false

        };
    }

    onSubmit(e){
    	e.preventDefault();

        let email = this.state.email;
        let password = this.state.password;

        this.props.mutate({
            variables: {
                "email": email,
				"password": password
            }
        }).then((response) => {
            if(response.data.authToken){
                localStorage.setItem('token', response.data.authToken.token);
                localStorage.setItem('userID', response.data.authToken.user.userID);
                window.location.replace('/');
            } else {
                this.setState({error: true})
            }

        });
	}


	render(){

		return(
			<div>
				<Grid>
                    <Row className="show-grid">
                        <Col xs={12} md={12} >
							<form className="form-signin" onSubmit={this.onSubmit.bind(this)}>
                                {this.state.error ?
                                    <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
                                        <h4>We have encountered an error.</h4>
                                        <p>Please reload the page and sign in again.</p>
                                    </Alert>
                                    : null
                                }
							<img src={logo} className="login-EF-logo" alt="EF logo" />
							<input type="text" className="email form-control" required placeholder="Email" value= {this.state.email} onChange={event => this.setState({ email: event.target.value})}/>
							<input type="password" className="password form-control" required placeholder="Password" value= {this.state.password} onChange={event => this.setState({ password: event.target.value})}/>
								<button className="login btn btn-lg btn-primary btn-block" type="submit">Login</button>
							</form>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

/*
 * Mutation Query
 * @args $email: String!, $password: String!
 */
const mutation = gql`
	mutation AuthToken ($email: String!, $password: String!){
  		authToken(email: $email , password: $password){
  			token
  			user{
  				userID
				firstName
				lastName
				email
				roles{
                    schoolID
                    role
                }
				photoURL
				photoUID
				langCode
				createdAt
				updatedAt
  			}
		}
	}
`;

export default graphql(mutation)(Login);

