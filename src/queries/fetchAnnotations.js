import gql from 'graphql-tag';

const getStudentInfo = gql`
    query getStudentInfo($userID: ID!, $tags: [String])
    {
        user(userID : $userID) {
            firstName
            lastName
            photoURL
        }
        annotations(filterStudentIDs: [$userID]) {
            annotationID
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
        filteredAnnotation : annotations(filterStudentIDs: [$userID], tags: $tags) {
            annotationID
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

export default getStudentInfo;