import { gql } from '@apollo/client'

export default gql`
  query tpopKmlQuery {
    allTpops(filter: { vTpopKmlsByIdExist: true }) {
      nodes {
        id
        vTpopKmlsById {
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
