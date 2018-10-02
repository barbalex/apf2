import gql from 'graphql-tag'

export default gql`
  query UserQuery {
    user @client {
      name
      token
    }
  }
`
