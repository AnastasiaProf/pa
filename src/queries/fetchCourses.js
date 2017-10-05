import gql from 'graphql-tag';

const CourseQuery = gql`
  query CourseQuery($teacherID: ID!) {
    courses(teacherID: $teacherID) {
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

export default CourseQuery;