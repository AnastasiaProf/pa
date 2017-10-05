import gql from 'graphql-tag';

const StudentsQuery = gql`
  query StudentsQuery {
    students {
      userID
      firstName
      lastName
      photoURL
    }
  }
`;