/**
 * Page layout, reused through the whole application
 * In .content it calls the child associated to the route
 */


import React, { Component } from 'react';
import '../../App.css';
import {Grid,Row,Col,Navbar,NavItem,Nav} from 'react-bootstrap';
import currentWeekNumber from 'current-week-number';
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
                        <Navbar inverse collapseOnSelect>
                            <Navbar.Header>
                              <Navbar.Brand>
                                <span>EF PA Portal</span>
                              </Navbar.Brand>
                              <Navbar.Toggle />
                            </Navbar.Header>
                            <Navbar.Collapse>
                              <Nav>
                                <NavItem eventKey={1}><Link to={`/`}>Review Media</Link></NavItem>
                                <NavItem eventKey={2}><Link to={`/students`}>Students</Link></NavItem>
                                <NavItem eventKey={2}><Link to={`/configuration`}>Settings</Link></NavItem>
                              </Nav>
                              <Nav pullRight>
                                <NavItem eventKey={1}><Link onClick={this.logout} to={`/signin`}>Logout</Link></NavItem>
                              </Nav>
                            </Navbar.Collapse>
                          </Navbar>
                        : null}
                    </Row>
                </Grid>
                <div className="content">
                    {this.props.children}
                </div>
                <div className="footer">
            
                </div>
            </div>

        );
    }
}

export default App;
