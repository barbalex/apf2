import { gql } from '@apollo/client'

export default gql`
  query TreeAllQuery(
    $apsFilter: ApFilter!
    $beobZugeordnetsFilter: BeobFilter!
    $popbersFilter: PopberFilter!
    $popmassnbersFilter: PopmassnberFilter!
    $popsFilter: PopFilter!
    $tpopbersFilter: TpopberFilter!
    $tpopfeldkontrsFilter: TpopkontrFilter!
    $tpopfreiwkontrsFilter: TpopkontrFilter!
    $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
    $tpopmassnbersFilter: TpopmassnberFilter!
    $tpopmassnsFilter: TpopmassnFilter!
    $tpopsFilter: TpopFilter!
    $adressesFilter: AdresseFilter!
    $apberrelevantGrundWertesFilter: TpopApberrelevantGrundWerteFilter!
    $ekAbrechnungstypWertesFilter: EkAbrechnungstypWerteFilter!
    $tpopkontrzaehlEinheitWertesFilter: TpopkontrzaehlEinheitWerteFilter!
    $zielbersFilter: ZielberFilter!
    $zielsFilter: ZielFilter!
    $isProjekt: Boolean!
    $isAps: Boolean!
    $isAp: Boolean!
    $isApPop: Boolean!
    $isBeobNichtBeurteilt: Boolean!
    $isPop: Boolean!
    $isTpop: Boolean!
    $isTpopkontr: Boolean!
    $isWerteListen: Boolean!
    $isZiel: Boolean!
    $isUsers: Boolean!
    $openAps: [UUID!]
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
    allPopbers(filter: $popbersFilter, orderBy: LABEL_ASC)
      @include(if: $isPop) {
      nodes {
        id
        popId
        label
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
    allPops(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC])
      @include(if: $isApPop) {
      nodes {
        id
        apId
        nr
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
    allTpopmassns(filter: $tpopmassnsFilter, orderBy: [JAHR_ASC, DATUM_ASC])
      @include(if: $isTpop) {
      nodes {
        id
        tpopId
        label
      }
    }
    allTpops(filter: $tpopsFilter, orderBy: [NR_ASC, FLURNAME_ASC])
      @include(if: $isPop) {
      nodes {
        id
        popId
        label
        nr
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
    allZielbers(filter: $zielbersFilter, orderBy: LABEL_ASC)
      @include(if: $isZiel) {
      nodes {
        id
        zielId
        label
      }
    }
    allZiels(filter: $zielsFilter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        id
        apId
        label
        jahr
      }
    }
  }
`
