import gql from 'graphql-tag'

export default gql`
  query view {
    allVPopKmlnamen {
      nodes {
        art
        label
        inhalte
        id
        lv95X: x
        lv95Y: y
        url
      }
    }
  }
`
