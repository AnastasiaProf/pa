/**
 * TeacherCourses Component
 * Retrieve all the courses of the teacher
 */

import React, {Component} from 'react';
import {Row, Tab, Nav, Col, NavItem} from 'react-bootstrap';
import { graphql } from 'react-apollo';
import PaCourseQuery from '../../queries/fetchPaCourses';
import AllCourses from './AllCourses';

class PaCourses extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    getCoursesID(courses){
        let coursesID = [];
        
        courses.map((course) => {
            coursesID.push(course.courseID);
        })
        
        return coursesID;
    }

    render(){
        if (this.props.data.loading){
            return <div>Loading...</div>;
        }
        
        console.log(this)
        let userID = localStorage.getItem('userID');
        let coursesID = this.getCoursesID(this.props.data.courses);

                return(
                    <div>
                        <AllCourses userID={userID} coursesID={coursesID} />
                    </div>
                );
    }
}

export default graphql(PaCourseQuery, {
    options:  (props) => {  { return  { variables: { paID: props.userID} } }  } })(PaCourses);