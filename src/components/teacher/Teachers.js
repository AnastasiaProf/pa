/**
 * Teachers Component
 * Teacher List Wrapper
 */

import React, {Component} from 'react';

import TeacherList from './TeacherList';


class Teachers extends Component{
	render(){
		return(
			<div>
        		{/*display the list of teachers*/}
        		<TeacherList/>
     		</div>
		);
	}
}

export default Teachers;

