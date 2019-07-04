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
        # ensure never before 1993
        tpopkontrsByTpopId(filter: { jahr: { greaterThanOrEqualTo: 1993 } }) {
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
