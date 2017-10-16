/**
 * TeacherCourses Component
 * Retrieve all the courses of the teacher
 */

import React, {Component} from 'react';
import {Row, Tab, Nav, Col, NavItem} from 'react-bootstrap';
import { graphql } from 'react-apollo';
import CourseQuery from '../../queries/fetchCourses';
import AllCourses from './AllCourses';

class TeacherCourses extends React.Component {

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
        
        let userID = localStorage.getItem('userID');
        let coursesID = this.getCoursesID(this.props.data.courses);

                return(
                    <div>
                        <AllCourses userID={userID} coursesID={coursesID} />
                    </div>
                );
    }
}

export default graphql(CourseQuery, {
    options:  (props) => {  { return  { variables: { teacherID: props.userID} } }  } })(TeacherCourses);