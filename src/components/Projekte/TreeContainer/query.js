import { gql } from '@apollo/client'

export default gql`
  query TreeAllQuery(
    $beobZugeordnetsFilter: BeobFilter!
    $popmassnbersFilter: PopmassnberFilter!
    $tpopbersFilter: TpopberFilter!
    $tpopfeldkontrsFilter: TpopkontrFilter!
    $tpopfreiwkontrsFilter: TpopkontrFilter!
    $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
    $tpopmassnbersFilter: TpopmassnberFilter!
    $adressesFilter: AdresseFilter!
    $apberrelevantGrundWertesFilter: TpopApberrelevantGrundWerteFilter!
    $ekAbrechnungstypWertesFilter: EkAbrechnungstypWerteFilter!
    $tpopkontrzaehlEinheitWertesFilter: TpopkontrzaehlEinheitWerteFilter!
    $isPop: Boolean!
    $isTpop: Boolean!
    $isTpopkontr: Boolean!
    $isWerteListen: Boolean!
  ) {
    apBeobsZugeordnet: allBeobs(
      filter: $beobZugeordnetsFilter
      orderBy: DATUM_DESC
    ) @include(if: $isTpop) {
      nodes {
        id
        label
        datum
        autor
        quelle
        tpopId
        artId
      }
    }
    allPopmassnbers(filter: $popmassnbersFilter, orderBy: LABEL_ASC)
      @include(if: $isPop) {
      nodes {
        id
        popId
        label
      }
    }
    allTpopbers(filter: $tpopbersFilter, orderBy: LABEL_ASC)
      @include(if: $isTpop) {
      nodes {
        id
        tpopId
        label
      }
    }
    allTpopfeldkontrs: allTpopkontrs(
      filter: $tpopfeldkontrsFilter
      orderBy: [JAHR_ASC, DATUM_ASC]
    ) @include(if: $isTpop) {
      nodes {
        id
        tpopId
        labelEk
      }
    }
    allTpopfreiwkontrs: allTpopkontrs(
      filter: $tpopfreiwkontrsFilter
      orderBy: [JAHR_ASC, DATUM_ASC]
    ) @include(if: $isTpop) {
      nodes {
        id
        tpopId
        labelEkf
      }
    }
    allTpopkontrzaehls(filter: $tpopkontrzaehlsFilter, orderBy: LABEL_ASC)
      @include(if: $isTpopkontr) {
      nodes {
        id
        tpopkontrId
        label
      }
    }
    allTpopmassnbers(filter: $tpopmassnbersFilter, orderBy: LABEL_ASC)
      @include(if: $isTpop) {
      nodes {
        id
        tpopId
        label
      }
    }
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
