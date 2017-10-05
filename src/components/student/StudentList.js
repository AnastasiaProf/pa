/**
 * Student List Component
 * Show all the student sof the teacher, grouped by class. Possibility of filter them by keying in a string.
 * TODO filter on lastname & firstname
 */

import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';
import CourseStudentQuery from '../../queries/fetchStudentsList'




class StudentList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: null,
            courses: []
        };
    }

    //on new properties coming set StudentList.state.courses to the new query returned value
    componentWillReceiveProps(nextProps){
        if(!(nextProps.courses == undefined)){
            this.setState({courses: nextProps.courses});
        }
    }


    //onChange of the input text update StudentList.state.filter
    updateSearch (e) {
        let filter = this.state.filter;

        this.setState({filter: e.target.value})
    }

    arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

//Count the number of annotations per student
    countAnnot(array){
        let counterarray = [];

        // Return today's date and time
        let currentTime = new Date();

        // returns the month (from 0 to 11)
        let current_month = currentTime.getMonth() + 1;


        // returns the year (four digits)
        let current_year = currentTime.getFullYear();

        if(!(array === undefined)){

            array.forEach(function(e){
                //Get the annotation date information
                let dates = e.createdAt.split("-");

                //Format date to compare week nbrs
                let dateparts = e.createdAt.split("T")[0].split("-");
                let nicedate = dateparts[1]+'/'+dateparts[2]+'/'+dateparts[0];
                if(!(e.students[0] === null) && !(e.students[0] === undefined) ){
                    if(!(e.students[0].userID === undefined)){
                        //If month then only count the one of the current mont
                        if(current_month === parseInt(dates[1]) && current_year === parseInt(dates[0]) && !e.deleted === true){
                            if(counterarray[e.students[0].userID] == undefined){
                                counterarray[e.students[0].userID] = 1;
                            } else {
                                counterarray[e.students[0].userID] += 1;
                            }
                        }
                    }
                }
            });
        }
        //If a students is shown but has no annotation set his number to 0
/*        this.props.data.students.forEach(function(e){
            if(!counterarray.hasOwnProperty(e.userID)){
                counterarray[e.userID] = 0;
            }
        });*/
        return counterarray;
    }


    render() {

        if (this.props.loading){
            return <div>Loading...</div>;
        }

        let courses = this.props.courses;

        let studentsLast = [];
        let studentsFirst = [];
        let studentsDisplay = [];

        let annotations = this.countAnnot(this.props.annotations);
        if(this.state.filter){
            {courses.map(course => {
                studentsLast[course.courseID] = course.students.filter( student =>
                    student.lastName.toLowerCase().match(this.state.filter.toLowerCase()) 
                );

                studentsFirst[course.courseID] = course.students.filter( student =>
                    student.firstName.toLowerCase().match(this.state.filter.toLowerCase())
                );

                studentsDisplay[course.courseID] = this.arrayUnique(studentsLast[course.courseID].concat(studentsFirst[course.courseID]))
            })}
        } else {
            {courses.map(course => {
                studentsDisplay[course.courseID] = course.students
            })}
        }



        return (
            <div>
              <Grid>
                <input className="search" type="text" placeholder="Search for a student by name" onChange={this.updateSearch.bind(this)}/>
                  {courses.map(course => {
                      if(studentsDisplay[course.courseID].length > 0){
                          return (
                              <Row key={course.courseID}>
                                <div className="classetitle">
                                  <h1>{course.description}</h1>
                                </div>
                                  {studentsDisplay[course.courseID].map(student => {
                                      let annot_nbr = annotations[student.userID];

                                      return (
                                          <Col xs={4} md={2} key={student.userID} >
                                            <Thumbnail className="profile">
                                                <div className="number-annotation"><span >{annot_nbr ? annot_nbr : "0"}</span></div>
                                                <Link to={`${course.courseID}/students/${student.userID}/?oldurl=studentslist`}>
                                                <img src={student.photoURL} alt="student picture"/>
                                                <h4>{student.firstName} {student.lastName}</h4>
                                              </Link>
                                            </Thumbnail>
                                          </Col>
                                      );
                                  })}
                              </Row>
                          );
                      }
                  })}
              </Grid>
            </div>
        );
    }

}


export default graphql(CourseStudentQuery, {
    options:  (props) => {  { return { variables: { teacherID: localStorage.getItem('userID')} } } },
    props: ({

    data: { loading, courses, annotations }}) => ({
        loading,
        courses,
        annotations
    })},)(StudentList);