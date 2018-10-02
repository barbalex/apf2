import gql from 'graphql-tag'

export default gql`
  query AllApsQuery {
    allAps {
      nodes {
        id
        artId
      }
    }
  }
`
