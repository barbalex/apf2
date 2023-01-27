import { gql } from '@apollo/client'

export default gql`
  query TreeAllQuery(
    $apsFilter: ApFilter!
    $apartsFilter: ApartFilter!
    $apbersFilter: ApberFilter!
    $apberuebersichtsFilter: ApberuebersichtFilter!
    $assozartFilter: AssozartFilter!
    $beobNichtBeurteiltsFilter: BeobFilter
    $beobNichtZuzuordnensFilter: BeobFilter
    $beobZugeordnetsFilter: BeobFilter!
    $ekfrequenzsFilter: EkfrequenzFilter!
    $ekzaehleinheitsFilter: EkzaehleinheitFilter!
    $erfkritsFilter: ErfkritFilter!
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
    $usersFilter: UserFilter!
    $adressesFilter: AdresseFilter!
    $apberrelevantGrundWertesFilter: TpopApberrelevantGrundWerteFilter!
    $ekAbrechnungstypWertesFilter: EkAbrechnungstypWerteFilter!
    $tpopkontrzaehlEinheitWertesFilter: TpopkontrzaehlEinheitWerteFilter!
    $zielbersFilter: ZielberFilter!
    $zielsFilter: ZielFilter!
    $isProjekt: Boolean!
    $isAps: Boolean!
    $isAp: Boolean!
    $isBeobNichtBeurteilt: Boolean!
    $isPop: Boolean!
    $isTpop: Boolean!
    $isTpopkontr: Boolean!
    $isWerteListen: Boolean!
    $isZiel: Boolean!
    $isApBerUebersicht: Boolean!
    $isCurrentIssues: Boolean!
    $isUsers: Boolean!
  ) {
    allAps(filter: $apsFilter, orderBy: LABEL_ASC) @include(if: $isProjekt) {
      totalCount
      nodes @include(if: $isAps) {
        id
        label
      }
    }
    allAparts(filter: $apartsFilter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        id
        apId
        label
      }
    }
    allApbers(filter: $apbersFilter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        id
        apId
        label
      }
    }
    allApberuebersichts(filter: $apberuebersichtsFilter, orderBy: LABEL_ASC)
      @include(if: $isProjekt) {
      totalCount
      nodes @include(if: $isApBerUebersicht) {
        id
        projId
        label
      }
    }
    allAssozarts(filter: $assozartFilter, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        id
        label
        apId
        aeId
      }
    }
    apBeobsNichtBeurteilt: allBeobs(
      filter: $beobNichtBeurteiltsFilter
      orderBy: DATUM_DESC
    ) @include(if: $isAp) {
      nodes {
        id
        label @include(if: $isBeobNichtBeurteilt)
        datum @include(if: $isBeobNichtBeurteilt)
        autor @include(if: $isBeobNichtBeurteilt)
        quelle @include(if: $isBeobNichtBeurteilt)
        aeTaxonomyByArtId {
          id
          apartsByArtId {
            nodes {
              id
              apId
            }
          }
        }
      }
    }
    apBeobsNichtZuzuordnen: allBeobs(
      filter: $beobNichtZuzuordnensFilter
      orderBy: DATUM_DESC
    ) @include(if: $isAp) {
      nodes {
        id
        label
        datum
        autor
        quelle
        artId
        aeTaxonomyByArtId {
          id
          apartsByArtId {
            nodes {
              id
              apId
            }
          }
        }
      }
    }
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
    allCurrentissues(orderBy: SORT_ASC) {
      totalCount
      nodes @include(if: $isCurrentIssues) {
        id
        label
      }
    }
    allEkfrequenzs(filter: $ekfrequenzsFilter, orderBy: SORT_ASC)
      @include(if: $isAp) {
      nodes {
        id
        apId
        code
      }
    }
    allEkzaehleinheits(
      filter: $ekzaehleinheitsFilter
      orderBy: [SORT_ASC, LABEL_ASC]
    ) @include(if: $isAp) {
      nodes {
        id
        apId
        label
      }
    }
    allErfkrits(
      filter: $erfkritsFilter
      orderBy: AP_ERFKRIT_WERTE_BY_ERFOLG__SORT_ASC
    ) @include(if: $isAp) {
      nodes {
        id
        apId
        label
      }
    }
    allMessages {
      totalCount
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
      @include(if: $isAp) {
      nodes {
        id
        apId
        nr
        label
      }
    }
    allProjekts(orderBy: NAME_ASC) {
      nodes {
        id
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
    allUsers(filter: $usersFilter, orderBy: LABEL_ASC) {
      totalCount
      nodes @include(if: $isUsers) {
        id
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
