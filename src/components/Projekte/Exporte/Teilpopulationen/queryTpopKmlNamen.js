import { gql } from '@apollo/client'

export default gql`
  query tpopKmlnamenQuery {
    allTpops(filter: { vTpopKmlnamenByIdExist: true }) {
      nodes {
        id
        vTpopKmlnamenById {
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
