import gql from 'graphql-tag'

export default gql`
  query viewTpopKmlnamen {
    allVTpopKmlnamen {
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
