import gql from 'graphql-tag';

const PaCourseQuery = gql`
  query CourseQuery($paID: ID!) {
    courses(paID: $paID) {
      courseID
      courseName
      description
      courseStartDate
      courseEndDate
      courseStartWeekCode
      courseEndWeekCode
      createdAt
      updatedAt
      courseSchedules{
        startStudyTime
        endStudyTime
        weekDay
      }
    }
    }
`;

export default PaCourseQuery;