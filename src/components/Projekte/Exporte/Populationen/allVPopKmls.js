import gql from 'graphql-tag'

export default gql`
  query view {
    allVPopKmls {
      nodes {
        art
        label
        inhalte
        id
        x
        y
        url
      }
    }
  }
`
