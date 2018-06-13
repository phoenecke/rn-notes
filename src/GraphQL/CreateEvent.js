import gql from 'graphql-tag'

export default gql`
  mutation createEvent(
    $name: String!
    $when: String!
    $where: String!
    $description: String!
  ) {
    createEvent(
      name: $name
      description: $description
      when: $when
      where: $where
    ) {
      id
      identityId
      name
      description
      when
      where
    }
  }
`
