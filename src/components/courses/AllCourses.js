
/* All Courses Component
* Get the list of all the courses the professor had
*
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import CourseQuery from '../../queries/fetchCourses';


class AllCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teachers: [],
        };
    }


    renderCourses(){
        let courses = this.props.data.courses;
        let teacherID = this.props.teacherID;


        return (
            <ul>
                {courses.map((course) => {
                    return (
                        <ListGroupItem key={course.courseID} ><Link to={`/${course.courseID}`}><h4>{course.description}</h4></Link></ListGroupItem>
                    );
                })}
            </ul>
        );
    }

    render(){
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
})(AllCourses)
