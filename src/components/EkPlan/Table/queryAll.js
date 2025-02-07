import { gql } from '@apollo/client'
import { ekfrequenz } from '../../shared/fragments.js'

export const queryAll = gql`
  query EkplanTpopQuery($tpopFilter: TpopFilter!, $apIds: [UUID!]) {
    allEkfrequenzs(filter: { apId: { in: $apIds } }, orderBy: SORT_ASC) {
      nodes {
        ...EkfrequenzFields
        ekAbrechnungstypWerteByEkAbrechnungstyp {
          id
          text
        }
      }
    }
    allTpops(
      filter: $tpopFilter
      orderBy: [AP_NAME_ASC, POP_BY_POP_ID__NR_ASC, NR_ASC]
    ) {
      totalCount
      nodes {
        id
        nr
        gemeinde
        flurname
        lv95X
        lv95Y
        ekfrequenz
        ekfrequenzStartjahr
        ekfrequenzAbweichend
        ekfrequenzByEkfrequenz {
          ekAbrechnungstyp
          id
          ekAbrechnungstypWerteByEkAbrechnungstyp {
            id
            text
          }
        }
        popStatusWerteByStatus {
          code
          text
        }
        bekanntSeit
        adresseByEkfKontrolleur {
          name
        }
        tpopkontrsByTpopId {
          nodes {
            id
            jahr
          }
        }
        popByPopId {
          id
          nr
          name
          popStatusWerteByStatus {
            code
            text
          }
          apByApId {
            id
            projId
            label
          }
        }
      }
    }
  }
  ${ekfrequenz}
`
