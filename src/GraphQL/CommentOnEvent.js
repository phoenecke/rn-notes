import gql from 'graphql-tag'

export default gql`
  mutation commentOnEvent(
    $eventId: String!
    $content: String!
    $createdAt: String!
  ) {
    commentOnEvent(
      eventId: $eventId
      content: $content
      createdAt: $createdAt
    ) {
      identityId
      eventId
      commentId
      createdAt
      content
    }
  }
`
