import { gql } from '@apollo/client'
import { ekfrequenz } from '../../shared/fragments'

export default gql`
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
            typ
            tpopkontrzaehlsByTpopkontrId {
              nodes {
                id
                einheit
                anzahl
                tpopkontrzaehlEinheitWerteByEinheit {
                  id
                  text
                  ekzaehleinheitsByZaehleinheitId(
                    filter: { zielrelevant: { equalTo: true } }
                  ) {
                    nodes {
                      id
                      zielrelevant
                    }
                  }
                }
              }
            }
          }
        }
        tpopmassnsByTpopId(
          filter: { tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: true } } }
        ) {
          nodes {
            id
            jahr
            typ
            beschreibung
            anzTriebe
            anzPflanzen
            zieleinheitAnzahl
            tpopkontrzaehlEinheitWerteByZieleinheitEinheit {
              id
              text
            }
            tpopmassnTypWerteByTyp {
              id
              text
            }
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
          popStatusWerteByStatus {
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
