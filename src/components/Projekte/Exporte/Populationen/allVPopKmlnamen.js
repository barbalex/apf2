import gql from 'graphql-tag'

export default gql`
  query view {
    allVPopKmlnamen {
      nodes {
        art
        label
        inhalte
        id
        wgs84Lat
        wgs84Long
        url
      }
    }
  }
`
