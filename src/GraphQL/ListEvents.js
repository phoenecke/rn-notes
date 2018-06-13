import gql from 'graphql-tag'

export default gql`
  query listEvents {
    listEvents {
      items {
        __typename
        id
        identityId
        name
        description
        when
        where
        comments {
          items {
            __typename
            commentId
            identityId
            createdAt
            content
          }
        }
      }
    }
  }
`
