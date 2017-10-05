/**
 * Teacher List Component
 * Retrieve all teacher from the database to navigate as one.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { graphql ,gql} from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

const TeacherQuery = gql`
  query TeacherQuery {
    teachers {
      userID
      firstName
      lastName
      email
      role
      photoURL
      photoUID
      langCode
      createdAt
      updatedAt
    }
  }
`;

class TeacherList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
    };
  }

  renderTeachers(){
    let teachers = this.props.data.teachers;


    return (
      <ul>
      {teachers.map((teacher) => {
            return ( 
              <ListGroupItem key={teacher.userID} ><Link to={`/${teacher.userID}`}><h4>{teacher.firstName} {teacher.lastName}</h4></Link></ListGroupItem>  
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
        <h2 className="title">Select the teacher</h2>
        <Grid>
          <Row>
            <Col xs={12} md={8} mdOffset={2}>
              {this.renderTeachers()}  
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }


}




export default graphql(TeacherQuery)(TeacherList)
