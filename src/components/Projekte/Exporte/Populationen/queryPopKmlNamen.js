import gql from 'graphql-tag'

export default gql`
  query popKmlNamenQuery {
    allPops {
      nodes {
        id
        vPopKmlnamenById {
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
    }
  }
`
