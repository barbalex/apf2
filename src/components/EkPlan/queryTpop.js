import gql from 'graphql-tag'

export default gql`
  query EkplanTpopQuery($aps: [UUID!]) {
    allTpops(
      filter: { popByPopId: { apId: { in: $aps } } }
      orderBy: [POP_BY_POP_ID__NR_ASC, NR_ASC]
    ) {
      totalCount
      nodes {
        id
        nr
        gemeinde
        flurname
        ekfrequenz
        ekfrequenzAbweichend
        ekAbrechnungstyp
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
            projId
            label
          }
        }
      }
    }
  }
`
