import gql from 'graphql-tag'

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
