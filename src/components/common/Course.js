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
import { graphql ,gql, compose} from 'react-apollo';
import { Link } from 'react-router-dom';
import {FormControl, Modal, Grid,Row,Col,Glyphicon,ListGroupItem, Button} from 'react-bootstrap';
import { StickyContainer, Sticky } from 'react-sticky';
import currentWeekNumber from 'current-week-number';
import Masonry from 'react-masonry-component';
import ReactPlayer from 'react-player';
import PubNubReact from 'pubnub-react';
import StudentHomeList from '../student/StudentHomeList';

const MediaQuery = gql`    
    query MediaQuery($courseID: ID!,$hideMediahubUploaded: Boolean!) {
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
        annotations(filterCourseIDs:[$courseID], hideMediahubUploaded:$hideMediahubUploaded) {
            annotationID
            deleted
            category
            uploadedToMediahubAt
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
    }
    }`;

var masonryOptions = {
    fitWidth: true,
    itemSelector: '.media2',
    gutter: 5
};

class Course extends Component{
    constructor(props) {
        super(props);
        
         this.pubnub = new PubNubReact({ publishKey: 'pub-c-9913e601-5fba-4c54-9b42-c234a93843b9', subscribeKey: 'sub-c-f213e53a-b270-11e7-9eb5-def16b84ebc1' });
        
        this.state = {
            list: {},
            filterStud: "",
            showModal: false,
            annotCheck: []
        };
    }
    
   
    componentWillMount() {
        this.pubnub.init(this);
        let courseID = this.props.match.params.courseID;
        this.pubnub.subscribe({ channels: [courseID], withPresence: true, autoload: 100});
    
        this.pubnub.getStatus((st) => {
            console.log('st', st);

        });
        this.pubnub.getMessage(courseID, (msg) => {
            if(msg.message.type == "mediahub"){
                this.props.data.refetch();
            }
        });
    };

    componentDidMount(){
        this.setState({list: this.child});
    }
    
    testPubNub(){
                let courseID = this.props.match.params.courseID;

                     this.pubnub.publish({channel: courseID, message: 'Hello!'}, (response) => {
                console.log('resp', response);
        
        });
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
        if(annotations.length > 0){
            annotations.map((annotation) => {

            if(annotation.deleted == false && annotation.category == "media" ){
                if(annotation.students.length == 0 ){
                    if(!("allclass" in array)){
                       array["allclass"] = []; 
                    }
                    array["allclass"].push(annotation);

                }else{
                     let index = "";
                
                     annotation.students.map((student, i) => {
                       index += student.userID;
                         if(!(i+1 == annotation.students.length)){
                            index += ",";
                         }
                       
                     })  
                      if(!(index in array)){
                           array[index] = [];
                        }
                        array[index].push(annotation);
                }
              } 
            })
        } 
        return(array);
    }
    
    countAnnot(annotations, contentType){
        let count = 0; 
        if(annotations.length > 0){
           annotations.map((annotation) => {
                if (annotation.contentType == contentType && annotation.deleted == false && annotation.category == "media"){
                    count += 1;
                }
            })
        } 
            return count;  
    }
    
    toggleChange(event) {
        event.target.id;
        let array = this.state.annotCheck;
        
        if (array.indexOf(event.target.id ) >= 0){
             array.splice(array.indexOf(event.target.id ), 1);
        }else{
            array.push(event.target.id);
        }
        
        this.setState({annotCheck: array});    
  }
    
    unCheck(){
        this.state.annotCheck.forEach(function(e){
            let ref = 'ref_' + e;
            this.refs[ref].checked = !this.refs[ref].checked;
        }, this)

    }
    
    onSubmit(event){
        event.preventDefault();
        let annot = this.state.annotCheck;
        let course = this.props.data.course.courseID;
        this.props.mutate({
            variables:{
                annotationIDs : annot,
            },
            refetchQueries: [{
                query: MediaQuery,
                variables: { courseID: course, hideMediahubUploaded: true },
            },]
        }).then(() => this.setState({annotCheck:[]}));
        this.unCheck()

    }
    
    onSubmitAll(event){
        event.preventDefault();
        let annots = [];
        this.props.data.annotation.forEach(function(e){
            if(e.deleted == false && e.category == "media" ){
                annots.push(e.annotationID)
            }
        });
        
        if(annots == []){
            return null;
        }
        
        this.props.mutate({
            variables:{
                "annotationIDs" : annots,
            },
        })
    }
    
//    addMedia(){
//        
//         let course = this.props.data.course.courseID;
//        
//         this.props.mutate({
//             variables: {
//                "annotation": {
//                    contentType: "image",
//                    category: "media",
//                    mediaURL: 'https://cdn.theatlantic.com/assets/media/img/photo/2015/11/images-from-the-2016-sony-world-pho/s01_130921474920553591/main_900.jpg',
//                    teacherID: localStorage.getItem('userID'),
//                    studentIDs: [],
//                    tags: [],
//                    deleted: false,
//                    courseID: course,
//                    //localCreatedAt : local,
//                }
//            }
//         })
//    }
    
    render(){
        let course = "";
        
       
        console.log(this)
        if (this.props.data.loading){
            return <div>Loading...</div>;
        }
        let annotweek = this.generateWeeks();
        
        let sorted = this.sortAnnot(this.props.data.annotations);
        
        let photo = this.countAnnot( this.props.data.annotations, "image");
        let video = this.countAnnot( this.props.data.annotations, "video");
        
        let  messages = this.pubnub.getMessage(this.props.data.course.courseID);
        console.log(messages)
        return(
            <div>
                  <StickyContainer>
                      <Sticky >
                      {
                        ({
                          style,
                          isSticky,
                          distanceFromBottom,
                          calculatedHeight
                        }) => {
                            if(this.state.annotCheck.length == 0){
                              return (        
                                <header style={{ position: 'fixed' , bottom: 0 , left: 0 , zIndex: 1000, width: "100%" }}>
                                      <div style={{height: 80, overflow: 'auto', background: '#fff'}}>
                                        <h4 className="selected">
                                            <span>{photo} Photos</span> <span>{video} Videos</span>
                                        </h4>
                                        <Button className="publish" onClick={this.onSubmitAll.bind(this)}>Publish All</Button>
                                      </div>  
                               </header>
                              )
                            }else{
                                 return (     
                                    <header style={{ position: 'fixed' , bottom: 0 , left: 0 , zIndex: 1000, width: "100%" }}>
                                          <div style={{height: 80, overflow: 'auto', background: '#fff'}}>
                                            <h4 className="selected">
                                                <span >{this.state.annotCheck.length} Selected</span>
                                            </h4>
                                              <Button className="publish" onClick={this.onSubmit.bind(this)}>Publish</Button>
                                          </div>  
                                   </header>
                                )
                            }
                        }
                      }
                    </Sticky>
                <Grid>
                    <Row className="show-grid">
                        {/*dropdown for sorting by ...*/}
                        <Col xs={12} md={12} >
                            <div className="course-description"><h2>{this.props.data.course.description}</h2></div>
                            <Link className="btn back class" to={`/`}><Glyphicon glyph="chevron-left" /> Back</Link>
                             {/*<Button onClick={this.testPubNub.bind(this)}>PubNub</Button>
                            <div>
                              <ul>
                                {messages.map((m, index) => !(m.message == undefined) ? <li key={'The media was published successfully !' + index}>{m.message.type}</li> : null)}
                              </ul>
                            </div>*/}
                            {/*<FormControl className="class-tag-filter" onChange={this.sortStud.bind(this)} componentClass="select" placeholder="select">
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
                                <Modal.Body>*/}
                                    {/*show the list of the week where annotaions were created ...*/}
                                    {/*<ul className="week-selector">
                                        {annotweek.map((week) => {
                                            return <ListGroupItem key={week} id={week} onClick={this.sortStud.bind(this)}>{week}</ListGroupItem>
                                        })}
                                    </ul>
                                </Modal.Body>
                            </Modal>*/}
                        </Col>
                    </Row>
                </Grid>
                                    
                 
                    
                                  
                 <Grid className="wide">
                  {Object.keys(sorted).map((key) => {
                    switch(key){
                        case "allclass":
                        return(
                            <div>
                            <div className="name">All Class</div>
                            <Row>
                    <Masonry className={'my-gallery-class'} options={masonryOptions} >
                             {sorted[key].map((annotation) => {
                                 switch(annotation.contentType){
                                    case "image":
                                       return (
                                            <span className="media2 images">
                                            <img className="img-size media"  key={annotation.annotationID} src={annotation.mediaURL}/>
                                            <div className="round">
                                                <input className="check" type="checkbox" id={annotation.annotationID} onChange={this.toggleChange.bind(this)} ref={'ref_' + annotation.annotationID}/> 
                                                <label htmlFor={annotation.annotationID}></label>
                                             </div>
                                            </span>
                                       
                                        );
                                        break;

                                    case "video":
                                         return (
                                          <span className="media2">
                                             <ReactPlayer  key={annotation.annotationID}  className="videomediaannotation media" url={annotation.mediaURL} controls/>
                                                 <div className="round">
                                                    <input className="check" type="checkbox" id={annotation.annotationID} onChange={this.toggleChange.bind(this)} ref={'ref_' + annotation.annotationID} />
                                                     <label htmlFor={annotation.annotationID}></label>
                                                </div>
                                            </span>
                                            
                           
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
                                {sorted[key][0].students.map((student) => {
                                    return (<div className="name">{student.firstName} {student.lastName}</div>);
                                })}
                                <Row>
                                <Masonry className={'my-gallery-class'} options={masonryOptions} >
                                {sorted[key].map((annotation) => {
                               
                                     switch(annotation.contentType){
                                        case "image":
                                           return (
                                                 <span className="media2 images">  
                                                <img  className="img-size media"   src={annotation.mediaURL}/>
                                                <div className="round">
                                                    <input className="check" type="checkbox" id={annotation.annotationID} onChange={this.toggleChange.bind(this)} ref={'ref_' + annotation.annotationID}/>
                                                    <label htmlFor={annotation.annotationID}></label>
                                                </div>
                                            </span>
                                               );
                                        break;

                                        case "video":
                                             return (
                                                <span className="media2"> 
                                                    <ReactPlayer  className="videomediaannotation media"  url={annotation.mediaURL} controls/>
                                                    <div className="round">
                                                        <input className="check" type="checkbox" id={annotation.annotationID} onChange={this.toggleChange.bind(this)} ref={'ref_' + annotation.annotationID}/>
                                                        <label htmlFor={annotation.annotationID}></label>
                                                    </div>
                                                </span>
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
                
                 </StickyContainer> 
                

                    
            </div>

        );
    }
}

/*
 * Mutation Query
 * @args $annotationIDs: [ID!]
 */
const mutation = gql`
	mutation uploadAnnotationToMediahub ($annotationIDs: [ID!]){
  		uploadAnnotationToMediahub(annotationIDs:$annotationIDs)	
	}
`;

/*
 * Mutation Query
 * @args $annotationIDs: [ID!]
 */
//const mutation2 = gql`
//	mutation addAnnotation ($annotation: AnnotationInput){
//  		addAnnotation(annotation:$annotation, uploadToMediahub:false)	
//	}
//`;



export default compose(
    graphql(MediaQuery, {
    options:  (props) => {  { return { variables: { courseID: props.match.params.courseID, teacherID: localStorage.getItem('userID'), hideMediahubUploaded:true} } } }}),
    graphql(mutation),
 //   graphql(mutation2)
)(Course);

