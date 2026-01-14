import { gql } from '@apollo/client'
import { ekfrequenz } from '../../../shared/fragments.ts'

export const queryRow = gql`
  query RowQueryForEkPlan(
    $apIds: [UUID!]
    $years: [Int!]
    $tpopId: UUID!
    $showEkf: Boolean!
    $showEkAbrechnungTyp: Boolean!
    $showBekanntSeit: Boolean!
    $showStatus: Boolean!
    $showFlurname: Boolean!
    $showGemeinde: Boolean!
    $showPopStatus: Boolean!
    $showPopName: Boolean!
    $showLv95X: Boolean!
    $showLv95Y: Boolean!
  ) {
    allEkfrequenzs(filter: { apId: { in: $apIds } }, orderBy: SORT_ASC) {
      nodes {
        ...EkfrequenzFields
        ekAbrechnungstypWerteByEkAbrechnungstyp {
          id
          text
        }
      }
    }
    tpopById(id: $tpopId) {
      id
      nr
      gemeinde @include(if: $showGemeinde)
      flurname @include(if: $showFlurname)
      lv95X @include(if: $showLv95X)
      lv95Y @include(if: $showLv95Y)
      ekfrequenz
      ekfrequenzStartjahr
      ekfrequenzAbweichend
      ekfrequenzByEkfrequenz @include(if: $showEkAbrechnungTyp) {
        ekAbrechnungstyp
        id
        ekAbrechnungstypWerteByEkAbrechnungstyp {
          id
          text
        }
      }
      popStatusWerteByStatus @include(if: $showStatus) {
        code
        text
      }
      bekanntSeit @include(if: $showBekanntSeit)
      adresseByEkfKontrolleur @include(if: $showEkf) {
        name
      }
      popByPopId {
        id
        nr
        name @include(if: $showPopName)
        popStatusWerteByStatus @include(if: $showPopStatus) {
          code
          text
        }
        apByApId {
          id
          projId
          label
        }
      }
      ekPlans: ekplansByTpopId(
        orderBy: JAHR_ASC
        filter: { typ: { equalTo: EK }, jahr: { in: $years } }
      ) {
        nodes {
          jahr
        }
      }
      ekfPlans: ekplansByTpopId(
        orderBy: JAHR_ASC
        filter: { typ: { equalTo: EKF }, jahr: { in: $years } }
      ) {
        nodes {
          jahr
        }
      }
      eks: tpopkontrsByTpopId(
        orderBy: JAHR_ASC
        filter: {
          typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" }
          jahr: { in: $years }
        }
      ) {
        nodes {
          id
          jahr
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
        filter: {
          typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
          jahr: { in: $years }
        }
      ) {
        nodes {
          id
          jahr
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
          jahr: { in: $years }
        }
      ) {
        nodes {
          id
          jahr
          zieleinheitAnzahl
        }
      }
    }
  }
  ${ekfrequenz}
`
