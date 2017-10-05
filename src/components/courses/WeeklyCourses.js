
import React from 'react';
import currentWeekNumber from 'current-week-number';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import CourseQuery from '../../queries/fetchCourses';


class WeeklyCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teachers: [],
        };
    }

    //Check wether the course is in the current week or not
    compareWeek(start, end){
        let current = currentWeekNumber();
        let today = new Date();
        let year = today.getFullYear();

        let wat = year.toString().substring(2).concat(current);


        if(parseInt(wat) <= parseInt(end) && parseInt(wat) >= parseInt(start)){
            return true;
        } else {
            return false;
        }
    }

    //Allow to sort array of objects by object value
    dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    //Create the array the hold the courses array[day_nbr] = [courses]
    classifyCourses(courses){
        let monday = [];
        let tuesday = [];
        let wednesday = [];
        let thursday = [];
        let friday = [];
        let saturday = [];
        let sunday = [];

        //For each fetched courses
        courses.forEach(function(course){
            let courseSchedules = course.courseSchedules;
            //If course in this current week
            if(this.compareWeek(course.courseStartWeekCode, course.courseEndWeekCode)){
                courseSchedules.forEach(function (courseSchedule) {
                    //Push the course in the good array
                    switch(courseSchedule.weekDay){
                        case "Mon":
                            monday.push({
                                courseID: course.courseID,
                                startStudyTime: courseSchedule.startStudyTime,
                                name: course.description.split(' ', 1)[0],
                                description: course.description
                            });
                            break;

                        case "Tue":
                            tuesday.push({
                                courseID: course.courseID,
                                startStudyTime: courseSchedule.startStudyTime,
                                name: course.description.split(' ', 1)[0],
                                description: course.description

                            });
                            break;

                        case "Wed":
                            wednesday.push({
                                courseID: course.courseID,
                                startStudyTime: courseSchedule.startStudyTime,
                                name: course.description.split(' ', 1)[0],
                                description: course.description
                            });
                            break;

                        case "Thu":
                            thursday.push({
                                courseID: course.courseID,
                                startStudyTime: courseSchedule.startStudyTime,
                                name: course.description.split(' ', 1)[0],
                                description: course.description
                            });
                            break;

                        case "Fri":
                            friday.push({
                                courseID: course.courseID,
                                startStudyTime: courseSchedule.startStudyTime,
                                name: course.description.split(' ', 1)[0],
                                description: course.description
                            });
                            break;

                        case "Sat":
                            saturday.push({
                                courseID: course.courseID,
                                startStudyTime: courseSchedule.startStudyTime,
                                name: course.description.split(' ', 1)[0],
                                description: course.description
                            });
                            break;

                        case "Sun":
                            sunday.push({
                                courseID: course.courseID,
                                startStudyTime: courseSchedule.startStudyTime,
                                name: course.description.split(' ', 1)[0],
                                description: course.description
                            });
                            break;
                    }
                });
            }
        }, this);

        //Sort all the arrays by start time
        monday = monday.sort(this.dynamicSort("startStudyTime"));
        tuesday = tuesday.sort(this.dynamicSort("startStudyTime"));
        wednesday = wednesday.sort(this.dynamicSort("startStudyTime"));
        thursday = thursday.sort(this.dynamicSort("startStudyTime"));
        friday = friday.sort(this.dynamicSort("startStudyTime"));
        saturday = saturday.sort(this.dynamicSort("startStudyTime"));
        sunday = sunday.sort(this.dynamicSort("startStudyTime"));


        let week = [
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday
        ];

        return week;
    }


    renderCourses(){
        let courses = this.props.data.courses;
        let teacherID = this.props.teacherID;

        let week = this.classifyCourses(courses);

        let dayname = "";

        return (
            <div>
                {week.map((day, index) => {
                    //Switch on week index to initiate the title component
                    switch(index){
                        case 0:
                            dayname = (<h3>Monday</h3>);
                            break;

                        case 1:
                            dayname = (<h3>Tuesday</h3>);
                            break;

                        case 2:
                            dayname = (<h3>Wednesday</h3>);
                            break;

                        case 3:
                            dayname = (<h3>Thursday</h3>);
                            break;

                        case 4:
                            dayname = (<h3>Friday</h3>);
                            break;

                        case 5:
                            dayname = (<h3>Saturday</h3>);
                            break;

                        case 6:
                            dayname = (<h3>Sunday</h3>);
                            break;
                    }
                    if(day.length > 0 ){
                    return(
                        <div key={index} >
                            <div className="day-name">{dayname}</div>
                            <ul>
                                {day.map((course) => {
                                    //For each course in the day render it
                                    return (
                                        <ListGroupItem key={course.courseID} ><Link to={`/${course.courseID}`}><h4>{course.name} - {course.startStudyTime}</h4></Link></ListGroupItem>
                                    );
                                })}
                            </ul>

                        </div>
                    );
                    } else { return null }
                })}
            </div>
        );
    }

    render(){
        console.log(this)
        if (this.props.data.loading){
            return <div>Loading...</div>;
        }
        return(
            <div>
                <Grid>
                    <Row>
                        <Col xs={12} md={8} mdOffset={2}>
                            {this.renderCourses()}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }


}




export default graphql(CourseQuery, {
    options:  (props) => {  { return { variables: { teacherID: props.teacherID} } } }
})(WeeklyCourses)
