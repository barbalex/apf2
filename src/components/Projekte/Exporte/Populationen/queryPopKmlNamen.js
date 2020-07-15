import { gql } from '@apollo/client'

export default gql`
  query popKmlNamenQuery {
    allPops(filter: { vPopKmlnamenByIdExist: true }) {
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
