import { gql } from '@apollo/client'

export default gql`
  query TreeAllQuery(
    $apberrelevantGrundWertesFilter: TpopApberrelevantGrundWerteFilter!
    $ekAbrechnungstypWertesFilter: EkAbrechnungstypWerteFilter!
    $tpopkontrzaehlEinheitWertesFilter: TpopkontrzaehlEinheitWerteFilter!
    $isWerteListen: Boolean!
  ) {
    tpopApberrelevantGrundWertesUnfiltered: allTpopApberrelevantGrundWertes {
      totalCount
    }
    allTpopApberrelevantGrundWertes(
      filter: $apberrelevantGrundWertesFilter
      orderBy: SORT_ASC
    ) @include(if: $isWerteListen) {
      totalCount
      nodes {
        id
        label
      }
    }
    ekAbrechnungstypWertesUnfiltered: allEkAbrechnungstypWertes {
      totalCount
    }
    allEkAbrechnungstypWertes(
      filter: $ekAbrechnungstypWertesFilter
      orderBy: SORT_ASC
    ) @include(if: $isWerteListen) {
      totalCount
      nodes {
        id
        label
      }
    }
    tpopkontrzaehlEinheitWertesUnfiltered: allTpopkontrzaehlEinheitWertes {
      totalCount
    }
    allTpopkontrzaehlEinheitWertes(
      filter: $tpopkontrzaehlEinheitWertesFilter
      orderBy: SORT_ASC
    ) @include(if: $isWerteListen) {
      totalCount
      nodes {
        id
        label
      }
    }
  }
`
