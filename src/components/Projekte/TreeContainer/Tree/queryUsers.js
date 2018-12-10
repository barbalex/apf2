import gql from 'graphql-tag'

export default gql`
  query UsersQuery {
    allUsers {
      nodes {
        id
        name
        email
        role
        pass
      }
    }
  }
`
