/**
 * Home Component
 * Composed of the course filter & the sort dropdown for the student list
 * Child : StudentHomeList
 */

import React, {Component} from 'react';
import {Row, Tab, Nav, Col, NavItem} from 'react-bootstrap';
import WeeklyCourses from '../courses/WeeklyCourses'
import UserCourses from '../courses/UserCourses'






class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            list: {},
            filterStud: ""
        };
    }



    render(){
        
        let userID = localStorage.getItem('userID');
        
        //Create 2 tabs, one of this week agenda and one with all the course from th start of the DB
        return(
            <div>
                 <UserCourses userID={userID} />
            </div>

        );
    }
}

export default Home;