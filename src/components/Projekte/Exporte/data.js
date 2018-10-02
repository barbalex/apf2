import gql from 'graphql-tag'

export default gql`
  query Query {
    export @client {
      applyMapFilterToExport
      fileType
    }
  }
`
