/**
 * Add Annotation Application
 * Composed of input text for annotation content, checkboxes for tags
 * TODO improve logic for tags to make it more dynamic
 */

import React, {Component} from 'react';
import { IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Panel, Button, FormGroup, Checkbox } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import getAnnotations from '../../queries/fetchClassAnnotations';


class AddAnnotation extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            contentType: '',
            text: '',
            studentIDs: [props.studentID],
            teacherID: props.teacherID,
            annotTags: [],
            suggestions:[] 
        };
    }
    
    componentDidMount(){
        let tags = this.props.tags;
        this.setState({suggestions: tags})
    }


    //onSubmit create tags array and run the mutation, then set annotation content to empty
    onSubmit(event){
        event.preventDefault();

        let teacherID = this.props.teacherID;
        let courseID = this.props.courseID;
        let tags = [];

        this.state.annotTags.map(tag =>
            tags.push(tag.text)
        )

        let date = new Date();
        let local = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()+"."+date.getMilliseconds()+"Z";


        this.props.mutate({
            variables: {
                "annotation": {
                    contentType: "text",
                    text: this.state.text,
                    teacherID: teacherID,
                    tags: tags,
                    deleted: false,
                    courseID: courseID,
                    //localCreatedAt : local,
                }
            },
            refetchQueries: [{
                query: getAnnotations,
                variables: { courseID: courseID },
            }]
        }).then(() => this.setState({text: '', annotTags:[], suggestions: this.props.tags}));
    }

//    handleChange(e){
//        if(this.state.annotTags.includes(e.target.value)){
//            var index = this.state.annotTags.indexOf(e.target.value);
//            this.state.annotTags.splice(index, 1);
//        } else {
//            this.state.annotTags.push(e.target.value);
//        }
//    }
    
   handleDelete(i) {
        let tags = this.state.annotTags;

        let suggestions = [];
        this.state.suggestions.forEach(function(e){
            suggestions.push(e)
        }, this)

        let result = tags.splice(i, 1);
        suggestions.push(result[0].text);

        console.log(suggestions);

        this.setState({annotTags: tags, suggestions: suggestions});
    }
 
    handleAddition(tag) {
        let tags = this.state.annotTags;

        let suggestions = [];
        this.state.suggestions.forEach(function(e){
            if(!(e == tag)){
            suggestions.push(e)
            }
        }, this)

        tags.push({
            id: tags.length + 1,
            text: tag
        })
        this.setState({annotTags: tags, suggestions: suggestions});
    }
 
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.annotTags;
 
        // mutate array 
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
 
        // re-render 
        this.setState({ annotTags: tags });
    }
  

    render(){
        let tags = this.props.tags;
        return(
			<div className="text-tag">
				<Button className="add-annoation" bsSize="large" block onClick={ ()=> this.setState({ open: !this.state.open })}> + Add a comment</Button>
				<Panel collapsible expanded={this.state.open} >
					<form onSubmit={this.onSubmit.bind(this)}>
						<textarea className="students" value= {this.state.text} onChange={event => this.setState({ text: event.target.value})}/>
                        <div className="formsubmit">
                            <FormGroup className="tags">
                                <ReactTags tags={this.state.annotTags} suggestions={this.state.suggestions} handleDelete={this.handleDelete.bind(this)} handleAddition={this.handleAddition.bind(this)} handleDrag={this.handleDrag.bind(this)}/>
                            </FormGroup>
                            <Button className="submit" type="submit">Submit</Button>
                        </div>
					</form>
				</Panel>
			</div>
        )
    }

}

/*
 * Mutation Query
 * @args $annotation: AnnotationInput!
 */
const mutation = gql`
	mutation AddAnnotation ($annotation: AnnotationInput!){
  		addAnnotation(annotation:$annotation)	
	}
`;

export default graphql(mutation)(AddAnnotation);