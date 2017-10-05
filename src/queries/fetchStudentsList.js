import gql from 'graphql-tag';



/*
 * Query to retrieve the students
 * @args $teacherID: ID
 */
const CourseStudentQuery = gql`
    query CourseStudentQuery($teacherID: ID){
        courses(teacherID: $teacherID) {
            students {
              userID
              firstName
              lastName
              email
              photoURL
              photoUID
              langCode
              createdAt
              updatedAt
            }
          courseID
          description
          courseName
          createdAt
          updatedAt
        }
        annotations(filterTeacherID: $teacherID){
            annotationID
            deleted
            createdAt
            students{
                userID
            }
        }
    }
    `;

export default CourseStudentQuery;