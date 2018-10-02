import gql from 'graphql-tag'

export default gql`
  query view {
    allVPopKmlnamen {
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
