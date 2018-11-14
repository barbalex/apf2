import gql from 'graphql-tag'

export default gql`
  query MyQuery {
    user @client {
      name
    }
  }
`
