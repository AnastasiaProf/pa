import gql from 'graphql-tag';

const CourseReviewMediaQuery = gql`
  query CourseReviewMediaQuery($filterCourseIDs: [ID]!, $filterCategory:AnnotationCategoryType!, $showDeleted: Boolean!, $hideMediahubUploaded: Boolean!){
    annotations(filterCourseIDs: $filterCourseIDs, filterCategory: $filterCategory, showDeleted: $showDeleted, hideMediahubUploaded: $hideMediahubUploaded){
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