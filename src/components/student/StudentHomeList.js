/**
 * StudentHomeList Component
 * Made of card representing a student. On each card a link that take to the student page is here.
 * The data fetched are reorder and filtered by the two dropdown on the Home component
 * Parent : Course
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { graphql ,gql} from 'react-apollo';
import { Grid, Row, Col, Thumbnail, Glyphicon } from 'react-bootstrap';
import currentWeekNumber from 'current-week-number';



/*
 * get students to show on the Course component
 * @args: $courseID: ID!, $teacherID: ID!
 */
const StudentsQuery = gql`
  query StudentsQuery($courseID: ID!, $teacherID: ID!) {
    students(courseID: $courseID) {
      userID
      firstName
      lastName
      photoURL

    }
    annotations(filterTeacherID: $teacherID){
    annotationID
    deleted
    createdAt
        students{
            userID
        }
    }
  }`;


class StudentHomeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortStud: "name",

        };
    }

    /**
     * Function to sort an array of objects by looking at the objects values
     * @args: [ Object, Object, ..., Object ]
     */
    dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property].toLowerCase() < b[property].toLowerCase()) ? -1 : (a[property].toLowerCase() > b[property].toLowerCase()) ? 1 : 0;
            return result * sortOrder;
        }
    }


    /*
     * Function to count the number of annotation per student
     * @args: array: [ annotation, annotation, ... , annotation ], month: boolean
     * @return: [ (String)studentid: (int)nbrannot, ... , (String)studentid: (int)nbrannot ]
     */
    countAnnot(array, type){
        let counterarray = [];

        // Return today's date and time
        let currentTime = new Date();

        // returns the month (from 0 to 11)
        let current_month = currentTime.getMonth() + 1;


        // returns the year (four digits)
        let current_year = currentTime.getFullYear();


        //get current week
        let currentWeekNbr = currentWeekNumber();

        if(type === "selweek") {
            currentWeekNbr = this.state.weekNbr;
        }

        if(!(array === undefined)){

            array.forEach(function(e){
                //Get the annotation date information
                let dates = e.createdAt.split("-");

                //Format date to compare week nbrs
                let dateparts = e.createdAt.split("T")[0].split("-");
                let nicedate = dateparts[1]+'/'+dateparts[2]+'/'+dateparts[0];
                let annotweek = currentWeekNumber(nicedate);

                if(!(e.students[0] === null) && !(e.students[0] === undefined) ){
                    if(!(e.students[0].userID === undefined) && !(e.deleted === true)){
                        //If month then only count the one of the current mont
                        if(type === "month" && current_month === parseInt(dates[1]) && current_year === parseInt(dates[0])){
                            if(counterarray[e.students[0].userID] == undefined){
                                counterarray[e.students[0].userID] = 1;
                            } else {
                                counterarray[e.students[0].userID] += 1;
                            }
                        } else if(type === "currweek" && parseInt(annotweek) === parseInt(currentWeekNbr) && current_year === parseInt(dates[0])){
                            if(counterarray[e.students[0].userID] === undefined){
                                counterarray[e.students[0].userID] = 1;
                            } else {
                                counterarray[e.students[0].userID] += 1;
                            }
                            //Else count everyone of them
                        } else if(type === "selweek" && parseInt(annotweek) === parseInt(currentWeekNbr) && current_year === parseInt(dates[0])){
                            if(counterarray[e.students[0].userID] === undefined){
                                counterarray[e.students[0].userID] = 1;
                            } else {
                                counterarray[e.students[0].userID] += 1;
                            }
                            //Else count everyone of them
                        }else if(type === "all") {
                            if(counterarray[e.students[0].userID] === undefined){
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
        this.props.data.students.forEach(function(e){
            if(!counterarray.hasOwnProperty(e.userID)){
                counterarray[e.userID] = 0;
            }
        });
        return counterarray;
    }

    //Sort students list by name
    sortName(students) {
        return students.concat().sort(this.dynamicSort("lastName"));
    }

    //Sort student list by annotations number
    sortAnnotAll(students, annotations) {
        return students.concat().sort(function(a, b){
            if (annotations[a.userID] < annotations[b.userID])
                return -1;
            if (annotations[a.userID] > annotations[b.userID])
                return 1;

            return 0;
        });
    }

    renderStudents(){
        let students = [];

        let annotations = [];

        let annot = false;

        if(this.state.sortStud){
            //Depending on sorting choice redirect to the goodworkflow of functions
            switch(this.state.sortStud) {
                case "name":
                    annot = true;
                    annotations = this.countAnnot(this.props.data.annotations, "month");
                    students = this.sortName(this.props.data.students);
                    break;

                case "fbmonth":

                    annot = true;
                    annotations = this.countAnnot(this.props.data.annotations, "month");
                    students = this.sortAnnotAll(this.props.data.students, annotations);
                    break;

                case "fbcurrweek":

                    annot = true;
                    annotations = this.countAnnot(this.props.data.annotations, "currweek");
                    students = this.sortAnnotAll(this.props.data.students, annotations);
                    break;

                case "fbselweek":

                    annot = true;
                    annotations = this.countAnnot(this.props.data.annotations, "selweek");
                    students = this.sortAnnotAll(this.props.data.students, annotations);
                    break;


                case "fball":
                    annot = true;
                    annotations = this.countAnnot(this.props.data.annotations, "all");
                    students = this.sortAnnotAll(this.props.data.students, annotations);
                    break;

                default:
                    students = this.sortName(this.props.data.students);

                    break;

            }
        }

        var teacherID = this.props.teacherID;

        return (
            students.map(({firstName, lastName, photoURL, userID}) => {
                let annot_nbr = "";

            if(annot){
                annot_nbr = annotations[userID];
                return (
                    <Col xs={4} sm={4} md={3} key={userID}>
                        <Thumbnail className="profile">
                            <div className="number-annotation"><span >{annot_nbr}</span></div>
                            <Link to={`/${this.props.filterStudValue}/students/${userID}/?oldurl=home`}>
                                <img src={photoURL} alt="student profile picture"/>
                                <h3>{firstName} {lastName}</h3>
                            </Link>
                        </Thumbnail>
                    </Col>
                );
            }else{

                return (
                    <Col xs={4} sm={4} md={3} key={userID}>
                        <Thumbnail className="profile">
                            <Link to={`/${this.props.filterStudValue}/students/${userID}/?oldurl=home`}>
                                <img src={photoURL} alt="student profile picture"/>
                                <h3>{firstName} {lastName}{annot_nbr}</h3>
                            </Link>
                        </Thumbnail>
                    </Col> 
                );
            }
        }));
    }

    render(){
        if (this.props.data.loading){
            return <div>Loading...</div>;
        }
         var teacherID = this.props.teacherID;
        return(
            <div>
                <Grid>
                    <Row>
                        <Col xs={12} md={8} mdOffset={2} className="class-link" >
                            <div className="class-link-button">
                                <Link to={`/${this.props.filterStudValue}/class`}>  Comment for all class </Link>
                            </div>
                        </Col>
                    </Row>
                    { this.state.showNav ?
                        <div><Row><Col xs={12} md={8} mdOffset={2} className="class-link" ><h2><a onClick={this.props.handler}>Week {this.state.weekNbr}    <small><Glyphicon glyph="pencil" /></small></a></h2></Col></Row></div>
                        : null }
                    <Row>
                        {this.renderStudents()}
                    </Row>
                </Grid>
            </div>
        );
    }


}




export default graphql(StudentsQuery, {
    withRef: true,
    options:  (props) => {  { return { variables: { courseID: props.filterStudValue, teacherID: props.teacherID} } } }
})(StudentHomeList)