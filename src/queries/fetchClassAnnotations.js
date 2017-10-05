import gql from 'graphql-tag';

const getAnnotations = gql`
    query getAnnotations($courseID: ID!, $tags: [String])
    {
        course(courseID: $courseID) {
            courseID                                                       
            courseName
            description
            courseStartDate
            courseEndDate
            courseStartWeekCode
            courseEndWeekCode
            createdAt
            updatedAt
        }
        annotations {
            annotationID
            students{
                userID
                firstName
                lastName
                photoURL          
            }
            course{
                courseID
                courseName
                description
            } 
            contentType
            mediaURL
            thumbnailURL
            text
            tags
            transcript
            classDate
            createdAt
            updatedAt
            transcribedAt
            deleted
        }
        filteredAnnotation : annotations(tags: $tags) {
            annotationID
            students{      
                userID     
                firstName  
                lastName   
                photoURL   
            }              
            course{        
                courseID   
                courseName 
                description
            }              
            contentType
            mediaURL
            thumbnailURL
            text
            tags
            transcript
            classDate
            createdAt
            updatedAt
            transcribedAt
            deleted
        }
        annotationTags{
            defaultTags
        }
    }
`;

export default getAnnotations;