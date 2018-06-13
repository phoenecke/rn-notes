import gql from 'graphql-tag'

export default gql`
  query listEvents {
    items {
      id
      identityId
      name
      description
      when
      where
      comments {
        items {
          commentId
          identityId
          createdAt
          content
        }
      }
    }
  }
`
