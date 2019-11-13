import gql from 'graphql-tag'

export default gql`
  query EkplanTpopQuery($tpopFilter: TpopFilter!) {
    allTpops(filter: $tpopFilter, orderBy: [POP_BY_POP_ID__NR_ASC, NR_ASC]) {
      totalCount
      nodes {
        id
        nr
        gemeinde
        flurname
        ekfrequenz
        ekfrequenzStartjahr
        ekfrequenzAbweichend
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
          filter: { tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: -1 } } }
        ) {
          nodes {
            id
            jahr
            typ
            beschreibung
            anzTriebe
            anzPflanzen
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
`
