import { gql } from '@apollo/client'

export const query = gql`
  query EkplanCellForYearQuery($tpopId: UUID!, $jahr: Int!) {
    tpopById(id: $tpopId) {
      id
      ekPlans: ekplansByTpopId(
        orderBy: JAHR_ASC
        condition: { typ: EK, jahr: $jahr }
      ) {
        totalCount
      }
      ekfPlans: ekplansByTpopId(
        orderBy: JAHR_ASC
        condition: { typ: EKF, jahr: $jahr }
      ) {
        totalCount
      }
      eks: tpopkontrsByTpopId(
        orderBy: JAHR_ASC
        filter: {
          typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
          jahr: { equalTo: $jahr }
        }
      ) {
        nodes {
          id
          tpopkontrzaehlsByTpopkontrId {
            nodes {
              id
              einheit
              anzahl
              tpopkontrzaehlEinheitWerteByEinheit {
                id
                ekzaehleinheitsByZaehleinheitId(
                  filter: { zielrelevant: { equalTo: true } }
                ) {
                  totalCount
                }
              }
            }
          }
        }
      }
      ekfs: tpopkontrsByTpopId(
        condition: { typ: "Freiwilligen-Erfolgskontrolle", jahr: $jahr }
      ) {
        nodes {
          id
          tpopkontrzaehlsByTpopkontrId {
            nodes {
              id
              einheit
              anzahl
              tpopkontrzaehlEinheitWerteByEinheit {
                id
                ekzaehleinheitsByZaehleinheitId(
                  filter: { zielrelevant: { equalTo: true } }
                ) {
                  totalCount
                }
              }
            }
          }
        }
      }
      ansiedlungs: tpopmassnsByTpopId(
        filter: {
          tpopmassnTypWerteByTyp: { ansiedlung: { equalTo: true } }
          jahr: { equalTo: $jahr }
        }
      ) {
        nodes {
          id
          zieleinheitAnzahl
        }
      }
    }
  }
`
