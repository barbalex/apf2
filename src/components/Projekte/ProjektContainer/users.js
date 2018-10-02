import gql from 'graphql-tag'

export default gql`
  query UsersQuery {
    users: allUsers {
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
