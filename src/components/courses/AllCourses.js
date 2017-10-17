
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
import CourseReviewMediaQuery from '../../queries/fetchCoursesReviewMedia';


class AllCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teachers: [],
        };
    }
    
    courseArray(annotations){
        let courses = [];
        let ids = [];
        let medias = [];
        if(annotations.length > 0){
            {annotations.map((annotation) => {
                let media =  annotation.uploadedtoMediahubAt;
                let course = annotation.course;
                if(media == null && !(course == undefined) && !(course == null)){
                    if(!(annotation.mediaURL == null) && annotation.category == "media"){
                     console.log(course.description, annotation)
                        if(!(course.courseID in medias)){
                            medias[course.courseID] = [];
                        }
                        switch(annotation.contentType){
                            case "image":
                                medias[course.courseID].push(annotation.mediaURL)
                                break;

                            case "video":
                                 medias[course.courseID].push(annotation.thumbnailURL)
                                break;
                        }  
                        if(ids.indexOf(course.courseID) == -1 ){
                            ids.push(course.courseID)
                            courses.push(course);
                        }
                    }

                }
            })}
        }
        
        return([courses, medias]);
    }


    renderCourses(){
        var annotations = this.props.data.annotations;
        let teacherID = this.props.teacherID;
        console.log(annotations)
        let array = this.courseArray(annotations);
        let courses = array[0];
        let medias = array[1];
           
        return (
            <ul>
                <h1 className="review-title">{courses.length} Lessons Pending to Review</h1>
                
                {courses.map((course, i) => {
                        var annot_nbr = 0;
                    
                        return (
                            
                            <Col xs={12} md={6} key={i} >
                                
                                <ListGroupItem  className="mediabox">
                                    <Link to={`/${course.courseID}`}><h4>{course.description}</h4></Link>
                                    {
                                    medias[course.courseID] == undefined ? null :
                                        medias[course.courseID].map((mediaURL,j) => {
                                        annot_nbr = medias[course.courseID].length;
 
                                            return (
                                                <Col className="imagepreview" xs={2} md={2} key={j}>
                                                    <img  src={mediaURL} />
                                                </Col>
                                            )
                                        })
                                    }
                                    <div className="annot_nbr"><span>{annot_nbr}</span></div>
                                </ListGroupItem>
                                
                            </Col>
                    );
                })}
            </ul>
        );
    }

    render(){
        console.log(this);

        if (this.props.data.loading){
            return <div>Loading...</div>;
        }
        return(
            <div>
                <Grid>
                    <Row>
                       
                            {this.renderCourses()}
                        
                    </Row>
                </Grid>
            </div>
        );
    }


}


export default graphql(CourseReviewMediaQuery, {
    options:  (props) => {  { return { variables: { filterCourseIDs: props.coursesID, filterCategory: "media", showDeleted: false, hideMediahubUploaded:true} } } }
})(AllCourses)
