/**
 * Home Component
 * Composed of the course filter & the sort dropdown for the student list
 * Child : StudentHomeList
 */

import React, {Component} from 'react';
import {Row, Tab, Nav, Col, NavItem} from 'react-bootstrap';
import WeeklyCourses from '../courses/WeeklyCourses'
import AllCourses from '../courses/AllCourses'






class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            list: {},
            filterStud: ""
        };
    }



    render(){
        let teacherID = localStorage.getItem('userID');

        //Create 2 tabs, one of this week agenda and one with all the course from th start of the DB
        return(
            <div>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row className="clearfix">
                        <Col sm={12} md={8} mdOffset={2} className="home-nav">
                            <Nav bsStyle="pills">
                                <NavItem eventKey="first" className="tab">
                                    This Week
                                </NavItem>
                                <NavItem eventKey="second" className="tab">
                                    All Classes
                                </NavItem>
                            </Nav>
                        </Col>

                        <Col sm={12}>
                            <Tab.Content animation>
                                <Tab.Pane eventKey="first">
                                    <WeeklyCourses teacherID={teacherID} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <AllCourses teacherID={teacherID} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>

        );
    }
}

export default Home;