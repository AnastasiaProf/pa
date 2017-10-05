/**
 * Delete Annotation Component
 * Composed of the course filter & the sort dropdown for the student list
 * Child : StudentHomeList
 */

import React, {Component} from 'react';
import { IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Button from 'react-bootstrap/lib/Button';
import getAnnotations from '../../queries/fetchClassAnnotations';


class DeleteAnnotation extends Component{

	//onClick call the mutation and refetch data
	onAnnotationDelete() {
		let teacherID = localStorage.getItem('userID');
		let courseID = this.props.courseID;
		this.props.mutate({
			variables: {
				annotationID: this.props.annotation.annotationID,
				annotation:{
					contentType: "text",
					teacherID: teacherID,
					courseID: courseID,
					deleted: true
				},
			},
			refetchQueries: [{ 
				query: getAnnotations,
                variables: { courseID: this.props.courseID }
            }]  
		});
	}

	render(){
		return(
			<Button className="delete-annotation" onClick={this.onAnnotationDelete.bind(this)}> Delete</Button>
		);
	}

}

/*
 * Mutation Query
 * @args $annotationID: ID! , $annotation: AnnotationInput!
 */
const mutation = gql`
	mutation DeleteAnnotation ($annotationID: ID! , $annotation: AnnotationInput!){
	  updateAnnotation(annotationID:$annotationID, annotation:$annotation) {
	    deleted
	  } 
	}
`;

export default graphql(mutation)(DeleteAnnotation);