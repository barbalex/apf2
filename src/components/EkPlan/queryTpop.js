import gql from 'graphql-tag'

export default gql`
  query EkplanTpopQuery($aps: [UUID!]) {
    allTpops(filter: { popByPopId: { apId: { in: $aps } } }) {
      totalCount
      nodes {
        id
        nr
        gemeinde
        flurname
        popStatusWerteByStatus {
          text
        }
        bekanntSeit
        tpopkontrsByTpopId {
          nodes {
            id
            jahr
            typ
          }
        }
        ekplansByTpopId {
          nodes {
            id
            jahr
            typ
          }
        }
        popByPopId {
          id
          nr
          name
          apByApId {
            id
            label
          }
        }
      }
    }
  }
`
