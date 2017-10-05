/**
 * Students Component
 * Wrapper for StudentList, pass teacherID
 * Child : StudentList
 */
import React, {Component} from 'react';

import StudentList from '../student/StudentList';


class Students extends Component{
	render(){
		var teacherID = localStorage.getItem('userID');
		return(
			<div>
        		{/*display the list of students*/}
        		<StudentList teacherID={teacherID}/>
     		</div>
		);
	}
}

export default Students;

