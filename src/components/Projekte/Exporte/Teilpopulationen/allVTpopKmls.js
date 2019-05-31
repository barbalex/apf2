import gql from 'graphql-tag'

export default gql`
  query view {
    allVTpopKmls {
      nodes {
        art
        label
        inhalte
        url
        id
        wgs84Lat
        wgs84Long
      }
    }
  }
`
