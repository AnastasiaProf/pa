/**
 * Home Component
 * Composed of the course filter & the sort dropdown for the student list
 * Child : StudentHomeList
 */

//{/*assign StudentHomeList as a child and pass into it the selected Course object & the current teacherID*/}
//                <StudentHomeList ref={(child) => {
//                    //Assign this.child to the instance of the component studenthomelist
//                    if(!(child == null )){
//                        this.child = child.getWrappedInstance();
//                    }
//                } } filterStudValue={this.props.match.params.courseID} teacherID={localStorage.getItem('userID')} handler={this.handler.bind(this)}/>

import React, {Component} from 'react';
import { graphql ,gql} from 'react-apollo';
import { Link } from 'react-router-dom';
import {FormControl, Modal, Grid,Row,Col,Glyphicon,ListGroupItem} from 'react-bootstrap';
import currentWeekNumber from 'current-week-number';
import Masonry from 'react-masonry-component';
import ReactPlayer from 'react-player';
import StudentHomeList from '../student/StudentHomeList';

const MediaQuery = gql`    
    query MediaQuery($courseID: ID!) {
        course(courseID: $courseID) {
            courseID                                                       
            courseName
            description
            courseStartDate
            courseEndDate
            courseStartWeekCode
            courseEndWeekCode
            createdAt
            updatedAt
        }
        annotations(filterCourseIDs:[$courseID]) {
            annotationID
            students{
                userID
                firstName
                lastName
                photoURL          
            }
            course{
                courseID
                courseName
                description
            } 
            contentType
            mediaURL
            thumbnailURL
            text
            tags
            transcript
            classDate
            createdAt
            updatedAt
            transcribedAt
            deleted
    }
    }`;

var masonryOptions = {
    columnWidth: 120
};


class Course extends Component{
    constructor(props) {
        super(props);

        this.state = {
            list: {},
            filterStud: "",
            showModal: false,
        };
    }


    componentDidMount(){
        this.setState({list: this.child});
    }

    //onChange set StudentHomeList.state.sortStud at dropdown value
    sortStud(e){
        if(e.target.value === "open"){
            this.open()
        } else if(!(e.target.id === "")) {
            this.close();
            this.child.setState({showNav: true});
            this.child.setState({sortStud: "fbselweek", weekNbr: parseInt(e.target.id)})
        } else {
            this.child.setState({showNav: false});
            this.child.setState({sortStud: e.target.value})
        }
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {

        this.setState({ showModal: true });
    }

    //Generate an array that contains all the weeks where some annotations were created
    generateWeeks(){
        let returnarray = [];

        // Return today's date and time
        let currentTime = new Date();

        // returns the year (four digits)
        let current_year = currentTime.getFullYear();

        if(!(this.props.data.annotations === undefined)){
            this.props.data.annotations.forEach(function(e){
                let dateparts = e.createdAt.split("T")[0].split("-");
                let nicedate = dateparts[1]+'/'+dateparts[2]+'/'+dateparts[0];
                let annotweek = currentWeekNumber(nicedate);

                if(!returnarray.includes(annotweek) && parseInt(current_year) === parseInt(dateparts[0])){
                    returnarray.push(annotweek)
                }
            })
        }
        return returnarray.sort()
    }

    handler(e) {
        e.preventDefault();
        this.setState({
            showModal: !this.state.showModal
        })
    }

    
    sortAnnot(annotations){
        
        let array = {};
        console.log(annotations)
        annotations.map((annotation) => {
            
            if(annotation.students.length == 0){
                if(!("allclass" in array)){
                   array["allclass"] = [];
                }
                array["allclass"].push(annotation);
            }else{
                 annotation.students.map((student) => {
                    if(!(student.userID in array)){
                       array[student.userID] = [];
                    }
                    array[student.userID].push(annotation);
                     
                 })  
            }
            
        })
        return(array);
    }
    
    handleClick(){
        
      alert("toto");
    }
    
    render(){
        console.log(this);
        let course = "";
        if (this.props.data.loading){
            return <div>Loading...</div>;
        }
        let annotweek = this.generateWeeks();
        
        let sorted = this.sortAnnot(this.props.data.annotations);
        console.log(sorted)
        return(
            <div>
                <Grid>
                    <Row className="show-grid">
                        {/*dropdown for sorting by ...*/}
                        <Col xs={12} md={12} >
                            <div className="course-description"><h2>{this.props.data.course.description}</h2></div>
                            <Link className="btn back class" to={`/`}><Glyphicon glyph="chevron-left" /> Back</Link>
                            <FormControl className="class-tag-filter" onChange={this.sortStud.bind(this)} componentClass="select" placeholder="select">
                                <option value="name">Name</option>
                                <option value="fbmonth">Feedback this month</option>
                                <option value="fbcurrweek">Feedback this week</option>
                                <option value="open">Select a week</option>
                                <option value="fball">All feedback</option>
                            </FormControl>
                            <Modal  bsSize="small" show={this.state.showModal} onHide={this.close.bind(this)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Select the week</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {/*show the list of the week where annotaions were created ...*/}
                                    <ul className="week-selector">
                                        {annotweek.map((week) => {
                                            return <ListGroupItem key={week} id={week} onClick={this.sortStud.bind(this)}>{week}</ListGroupItem>
                                        })}
                                    </ul>
                                </Modal.Body>
                            </Modal>
                        </Col>
                    </Row>
                </Grid>
                                    
                                    
                 <Grid>
                  {Object.keys(sorted).map((key) => {
                    switch(key){
                        case "allclass":
                        return(
                            <div>
                            <div>All Class</div>
                            <Row>
                    <Masonry className={'my-gallery-class'} options={masonryOptions} >
                             {sorted[key].map((annotation) => {
                                 switch(annotation.contentType){
                                    case "image":
                                       return (
                                            <div onClick={this.handleClick().bind(this)}>
                                            <img className="img-size"  key={annotation.annotationID} src={annotation.mediaURL}/>
                                            <svg width="24px" height="24px" fill="blue" class="JUQOtc orgUxc" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                                            </div>
                                       
                                        );
                                        break;

                                    case "video":
                                         return (
                                          <div onClick={this.handleClick().bind(this)}>
                                             <ReactPlayer  key={annotation.annotationID}  className="videoannotation" url={annotation.mediaURL} controls/>
                                              <svg width="24px" height="24px" fill="blue" class="JUQOtc orgUxc" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                                            </div>
                                            
                           
                                        );
                                        break;
                                } 
                             })}
                        </Masonry> 
                                
                                  
                             
                                 
                             </Row>
                            </div>
                        )  
                         break;
                        
                        default : 
                            return(
                                <div>
                                <div>{sorted[key][0].students[0].firstName}</div>
                                <Row>
                                <Masonry className={'my-gallery-class'} options={masonryOptions} >
                                {sorted[key].map((annotation) => {
                               
                                     switch(annotation.contentType){
                                        case "image":
                                           return (
                                                 <div onClick={this.handleClick().bind(this)}>  
                                                <img className="img-size"   src={annotation.mediaURL}/>
                                               <svg width="24px" height="24px" fill="blue" class="JUQOtc orgUxc" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                                            </div>
                                               );
                                        break;

                                        case "video":
                                             return (
                                                <div onClick={this.handleClick().bind(this)}> 
                                                    <ReactPlayer className="videoannotation"  url={annotation.mediaURL} controls/>
                                                 <svg width="24px" height="24px" fill="blue" class="JUQOtc orgUxc" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                                            </div>
                                             );
                                        break;
                                    }
                                })} 
                                </Masonry>
                                 
                               

                                </Row>
                              </div>
                            )
                    }
                    
                    
                    })}
                
                

               
                </Grid>

            </div>

        );
    }
}

export default graphql(MediaQuery, {
    options:  (props) => {  { return { variables: { courseID: props.match.params.courseID, teacherID: localStorage.getItem('userID')} } } }
})(Course);

