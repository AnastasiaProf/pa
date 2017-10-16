import gql from 'graphql-tag';

const CourseReviewMediaQuery = gql`
  query CourseReviewMediaQuery($filterCourseIDs: [ID]!, $filterContentTypes: [AnnotationContentType]!, $showDeleted: Boolean!){
    annotations(filterCourseIDs: $filterCourseIDs, filterContentTypes: $filterContentTypes, showDeleted: $showDeleted){
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