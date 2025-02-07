import { gql } from '@apollo/client'

export const queryAll = gql`
  query EkplanTpopQuery(
    $tpopFilter: TpopFilter!
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
    allTpops(
      filter: $tpopFilter
      orderBy: [AP_NAME_ASC, POP_BY_POP_ID__NR_ASC, NR_ASC]
    ) {
      totalCount
      nodes {
        id
        nr
        gemeinde @include(if: $showGemeinde)
        flurname @include(if: $showFlurname)
        lv95X @include(if: $showLv95X)
        lv95Y @include(if: $showLv95Y)
        # ekfrequenz
        # ekfrequenzStartjahr
        # ekfrequenzAbweichend
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
      }
    }
  }
`
