import { gql } from '@apollo/client'

export default gql`
  query popKmlQuery {
    allPops(filter: { vPopKmlsByIdExist: true }) {
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
