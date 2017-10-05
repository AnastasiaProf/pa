/**
 * Student Annotations Component
 * Used in StudentPage for diplay and update of the annotations
 * Child : DeleteStudentAnnotations
 */
import React, {Component} from 'react';
import {Alert, Panel, Button, Checkbox, FormGroup} from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import {Scroll,Element, scroller} from 'react-scroll';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import Moment from 'react-moment';
import DeleteClassAnnotation from './DeleteClassAnnotation';
import getAnnotations from '../../queries/fetchClassAnnotations';




class CourseAnnotations extends Component{
    constructor(props){
        super(props);

        this.state = {
            filterAnnot: "",
            all : true,
            modify: '',
            currenttags: [],
            alertVisible: false
        }
    }
    
     componentDidMount(){
        let tags = this.props.tags;
        this.setState({suggestions: tags})
    }

    //Initialization on update annotation click
    initiateUpdate(event){
        event.preventDefault();
        
        //check if this.state.modify is "" if yes continue if no popup messages to ask to save current modified annot
        if (this.state.modify == ''){
            
        //Add in current the id of the annotation
         var current = event.target.id;


        //Initialise the array of checkboxes in this.state.checkboxes with the annot.ID as the key
        var currenttags = this.state.currenttags;
        currenttags = [];

        //Return the annotation object
        let result = this.props.annotations.filter(function( obj ) {
            return obj.annotationID == event.target.id;
        })[0];

        //If some tags are linked add them in the this.state.checkboxes array
        if(!(result.tags === null)){
                result.tags.forEach(function(e, i){
                    currenttags.push({
                        id: i + 1,
                        text: e
                    });
                });
            
            } 


      var suggestions = new Array();
                this.state.suggestions.forEach(function(e){
                    if(!(result.tags.includes(e))){
                        suggestions.push(e)
                    }
            }, this)
             
        }else{  
            return(
                this.setState(
                    {alertVisible: true},
                    scroller.scrollTo('alertpost', {
                        duration: 1500,
                        smooth: true}
                    )
                )  
            )
        }
        


        this.setState({modify: current, currenttags: currenttags, suggestions: suggestions})
    }
        
    handleAlertDismiss() {
        var annotID = this.state.modify;
        
         this.setState({alertVisible: false}, 
                        scroller.scrollTo(JSON.parse(JSON.stringify({annotID})).annotID, {
                            duration: 1500,
                            smooth: true}
                        )
                     )
    }


    /*If annotation is being updated will initialize checkbobxes state
     *  param: annot: ID!
     */
    preChecking(annot){
           //Initiate HTML DOM element with previous value and attach change handle on it
        let tags_values;

        tags_values = <ReactTags id={annot} tags={this.state.currenttags} suggestions={this.state.suggestions} handleDelete={this.handleDelete.bind(this)} handleAddition={this.handleAddition.bind(this)} handleDrag={this.handleDrag.bind(this)}/>
        
        //Return the initialized checboxes
        return (
            tags_values
        )
    }

    //Handle text changes
    handleChange(event){
        this.setState({text: event.target.value})
    }

    handleDelete(i) {
        let tags = this.state.currenttags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }
 
    handleAddition(tag) {
       
        let tags = this.state.currenttags;
        let suggestions = [];
        this.state.suggestions.forEach(function(e){
            if(!(e == tag)){
            suggestions.push(e)
            }
        }, this)
        console.log(suggestions)
        tags.push({
            id: tags.length + 1,
            text: tag
        })
        this.setState({tags: tags, suggestions: suggestions});
    }
 
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.currenttags;
 
        // mutate array 
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
 
        // re-render 
        this.setState({ tags: tags });
    }

    //Submit of the update form
    onSubmit(event){

        event.preventDefault();

        let annotID = event.target.id;
        let modannot = this.state.modify;
        let teacherID = localStorage.getItem('userID');
        let courseID = this.props.courseID;

        let filterTag = this.state.filterTags;

        let updatetags;

        if(this.state.currenttags.length == 0){
            updatetags = null;
        } else {
            updatetags = [];
            this.state.currenttags.forEach(function(e){
                updatetags.push(e.text);
            })
        }

        this.props.mutate({
            variables: {
                annotationID: modannot,
                annotation: {
                    contentType: "text",
                    teacherID: teacherID,
                    courseID: courseID,
                    tags: updatetags,
                    text: this.state.text
                }
            },
            refetchQueries: [{
                query: getAnnotations,
                variables: { tags: filterTag, text: this.state.text, courseID: courseID},
            }]
        }).then(() =>
            this.setState({modify: "", currenttags: []})
        );
    }


    //Render annotation HTML depending of their type
    render(){


        var weeks = this.props.weeks;
        let courseID = this.props.courseID;
        let tags = this.props.tags;


        return(
            <div>
            <Element name="alertpost">
            {this.state.alertVisible ?
                    <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss.bind(this)}>
                            <h4>Oops!You didn't submit your changes.</h4>
                            <p>Please Submit before you change another annotation.</p>
                            <p>
                                <Button onClick={this.handleAlertDismiss.bind(this)}>Hide Alert</Button>
                            </p>
                    </Alert>
                    : null
                }</Element>
                {weeks.map((week) => {
                return(
                    <div key={week['week_nbr']}>
                        <h1 className="week-nbr">Week {week['week_nbr']}</h1>
                        
                        {week.map(annotation => {
                    if(!(annotation.deleted == true)){
                        let tag_verif = false;
                        if(!(annotation.tags === null)){
                            if(!(annotation.tags.length == 0)){
                                tag_verif = true;
                            }
                        }
                       
                        if(annotation.contentType == "image"){
                            return (
                                <Panel className="annotation" key={annotation.annotationID}>
                                    <div className="tag-container" >
                                        {/*if no tags then do not try to loop over it (Code breakage prevention)*/}
                                        { tag_verif ?
                                            annotation.tags.map(tag => {
                                                return(
                                                    <p className="tag" key={tag}>{tag}</p>
                                                );
                                            }) : <p>No Feedback Type</p>
                                        }
                                    </div>
                                    <img src={annotation.mediaURL} />

                                    <div>
                                        <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                        <DeleteClassAnnotation annotation={annotation} courseID={courseID}/>
                                    </div>
                                </Panel>
                            );
                        }else if(annotation.contentType == "video"){
                            return (
                                <Panel className="annotation" key={annotation.annotationID}>
                                    <div className="tag-container" >
                                        { tag_verif ?
                                            annotation.tags.map(tag => {
                                                return(
                                                    <p className="tag" key={tag}>{tag}</p>
                                                );
                                            }) : <p>No Feedback Type</p>
                                        }
                                    </div>
                                    <ReactPlayer url={annotation.mediaURL} controls/>

                                    <div>
                                        <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                        <p><DeleteClassAnnotation annotation={annotation} courseID={courseID}/></p>
                                    </div>
                                </Panel>
                            );
                        }else if(annotation.contentType == "text"){
                            if(this.state.modify.includes(annotation.annotationID)){
                                return (
                                     <Element key={annotation.annotationID} name={this.state.modify}>
                                    <Panel className="annotation" >
                                        <form onSubmit={this.onSubmit.bind(this)} id={annotation.annotationID}>
                                    
                                            { this.preChecking(annotation.annotationID)}

                                            <p className="content-text"><textarea spellCheck="true" className="modify-text" defaultValue={annotation.text} onChange={this.handleChange.bind(this)} /></p>

                                            <div className="annotation-bottom">
                                                <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                                <Button className="submit change" type="submit">Submit</Button>
                                                <p><DeleteClassAnnotation annotation={annotation} courseID={courseID}/></p>
                                            </div>
                                        </form>
                                    </Panel>
                                </Element>
                                );
                            } else {
                                return (
                                    <Panel className="annotation" key={annotation.annotationID}>
                                        <a className="update" onClick={this.initiateUpdate.bind(this)} id={annotation.annotationID} href="#">Modify</a>
                                        <div className="tag-container">
                                            { tag_verif ?
                                                annotation.tags.map(tag => {
                                                    return(

                                                        <p className="tag" key={tag}>{tag}</p>
                                                    );
                                                }) : <p>No Feedback Type</p>
                                            }
                                        </div>
                                        <p></p>
                                        <p className="content-text">{annotation.text}</p>

                                        <div className="annotation-bottom">
                                            <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                            <p><DeleteClassAnnotation annotation={annotation} courseID={courseID}/></p>
                                        </div>
                                    </Panel>
                                );
                            }
                        }else if(annotation.contentType == "audio"){
                            return (
                                <Panel className="annotation" key={annotation.annotationID}>
                                    <div className="tag-container" >
                                        { tag_verif ?
                                            annotation.tags.map(tag => {
                                                return(
                                                    <p className="tag" key={tag}>{tag}</p>
                                                );
                                            }) : <p>No Feedback Type</p>
                                        }
                                    </div>
                                    <ReactAudioPlayer src={annotation.mediaURL} controls />
                                    <p className="content-text">{annotation.transcript}</p>

                                    <div className="annotation-bottom">
                                        <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                        <p><DeleteClassAnnotation annotation={annotation} courseID={courseID}/></p>
                                    </div>
                                </Panel>
                            );
                        }
                    }
                })}
                    </div>
                )
            })}
            </div>
        );
    }
}


/*
 * Mutation Query
 * @args $annotation: AnnotationInput!
 */
const mutation = gql`
    mutation UpdateAnnotationTag ($annotationID: ID! , $annotation: AnnotationInput!){
        updateAnnotation(annotationID:$annotationID, annotation:$annotation) {
        tags
        text
        } 
    }
`;



export default  graphql(mutation)(CourseAnnotations);

