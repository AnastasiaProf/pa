import gql from 'graphql-tag';

const CourseReviewMediaQuery = gql`
  query CourseReviewMediaQuery{
    annotations{
      mediaURL
      thumbnailURL
      annotationID
      category
      contentType
      uploadedToMediahubAt
      course{
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
}

`;

export default CourseReviewMediaQuery;