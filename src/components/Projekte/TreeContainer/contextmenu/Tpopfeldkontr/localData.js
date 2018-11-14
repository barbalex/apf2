import gql from 'graphql-tag'

export default gql`
  query {
    copyingBiotop @client {
      id
      label
    }
  }
`
