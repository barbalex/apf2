import gql from 'graphql-tag'

export default gql`
  query view {
    allVTpopKmlnamen {
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
