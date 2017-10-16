import gql from 'graphql-tag';

const UserQuery = gql`
  query UserQuery($userID: ID!) {
    user(userID: $userID) {
        userID
        firstName
        lastName
        email
        roles{
            schoolID
            role
        }
        photoURL
        photoUID
        langCode
        createdAt
        updatedAt
    }
    }
`;

export default UserQuery;