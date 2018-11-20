// @flow
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export default graphql(gql`
  query Query {
    tree @client {
      activeNodeArray
    }
    tree2 @client {
      activeNodeArray
    }
  }
`)
