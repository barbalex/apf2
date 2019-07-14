import gql from 'graphql-tag'

import {
  ekAbrechnungstypWerte,
  tpopApberrelevantGrundWerte,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

export default gql`
  query WerteDataQuery(
    $isWerteListen: Boolean!
    $adressesFilter: AdresseFilter!
    $apberrelevantGrundWertesFilter: TpopApberrelevantGrundWerteFilter!
    $ekAbrechnungstypWertesFilter: EkAbrechnungstypWerteFilter!
    $tpopkontrzaehlEinheitWertesFilter: TpopkontrzaehlEinheitWerteFilter!
  ) {
    adressesUnfiltered: allAdresses {
      totalCount
    }
    allAdresses(filter: $adressesFilter, orderBy: LABEL_ASC)
      @include(if: $isWerteListen) {
      totalCount
      nodes {
        id
        name
        label
      }
    }
    tpopApberrelevantGrundWertesUnfiltered: allTpopApberrelevantGrundWertes {
      totalCount
    }
    allTpopApberrelevantGrundWertes(
      filter: $apberrelevantGrundWertesFilter
      orderBy: SORT_ASC
    ) @include(if: $isWerteListen) {
      totalCount
      nodes {
        ...TpopApberrelevantGrundWerteFields
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
        ...EkAbrechnungstypWerteFields
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
        ...TpopkontrzaehlEinheitWerteFields
      }
    }
  }
  ${ekAbrechnungstypWerte}
  ${tpopApberrelevantGrundWerte}
  ${tpopkontrzaehlEinheitWerte}
`
