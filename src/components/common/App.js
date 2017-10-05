/**
 * Page layout, reused through the whole application
 * In .content it calls the child associated to the route
 */


import React, { Component } from 'react';
import '../../App.css';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router-dom';
import logo from '../../blacklogo.png';

class App extends Component {

    constructor(props) {
        super(props);
        //On logout delete all the localsotrage and get rid of query cache
        this.logout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userID')
            .then(() =>
                props.client.resetStore()
            )
            .catch(err =>
                console.error('Logout failed', err)
            );
        }
    }

    render() {
        //If the token is stored in a local storage then display the menu
        return (
            <div>
                <Grid>
                    <Row>
                        {localStorage.getItem('token') ?
                            <Col xs={12} md={12}>
                                <ul className="header">
                                    <li> <img src={logo} className="EF-logo" alt="EF logo" /> </li>
                                    <li><Link to={`/`}>Home</Link></li>
                                    <li><Link to={`/students`}>Students</Link></li>
                                    <li><Link to={`/configuration`}>Settings</Link></li>
                                    <li className="logout"><Link onClick={this.logout} to={`/signin`}>Logout</Link></li>
                                </ul>
                            </Col>
                        : null}
                    </Row>
                </Grid>
                <div className="content">
                    {this.props.children}
                </div>
            </div>

        );
    }
}

export default App;
