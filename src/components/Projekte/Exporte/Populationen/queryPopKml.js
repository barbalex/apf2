import gql from 'graphql-tag'

export default gql`
  query popKmlQuery {
    allPops {
      nodes {
        id
        vPopKmlsById {
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
