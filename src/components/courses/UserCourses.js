/**
 * UserCourses Component
 * Call User data to check if PA or Teacher.
 * Will call different component depending of the result
 */

import React, {Component} from 'react';
import {Row, Tab, Nav, Col, NavItem} from 'react-bootstrap';
import { graphql } from 'react-apollo';
import UserQuery from '../../queries/fetchUser';
import TeacherCourses from './TeacherCourses';
import PaCourses from './PaCourses';


class UserCourses extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            
        };
    }



    render(){
        if (this.props.data.loading){
            return <div>Loading...</div>;
        }
        let userID = localStorage.getItem('userID');
        switch(this.props.data.user.roles[0].role){
            case "teacher":
                return(
                    <div>
                        <TeacherCourses userID={userID} />
                    </div>
                );
                break;
                
            case "pa":
                return(
                    <div>
                        <PaCourses userID={userID} />
                    </div>
                );
                break;
                
            default:
                return(
                    <div>
                 
                    </div>
                );
                break;
        }
        
    }
}

export default graphql(UserQuery, {
    options:  (props) => {  { return  { variables: { userID: props.userID} } }  } })(UserCourses);