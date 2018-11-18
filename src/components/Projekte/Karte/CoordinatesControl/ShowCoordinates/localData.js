import gql from 'graphql-tag'

export default gql`
  query GetMapMouseCoordinates {
    mapMouseCoordinates @client {
      x
      y
    }
  }
`
