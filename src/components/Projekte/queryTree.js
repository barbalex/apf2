import { gql } from '@apollo/client'

import {
  ap,
  apart,
  apberuebersicht,
  currentIssue,
  ekfrequenz,
  ekzaehleinheit,
  erfkrit,
  popber,
  popmassnber,
  pop,
  projekt,
  tpopber,
  tpopfeldkontr,
  tpopfreiwkontr,
  tpopkontrzaehl,
  tpopmassnber,
  tpopmassn,
  tpop,
  user,
  ekAbrechnungstypWerte,
  tpopApberrelevantGrundWerte,
  tpopkontrzaehlEinheitWerte,
  zielber,
  ziel,
} from '../shared/fragments'

export default gql`
  query TreeAllQuery(
    $apsFilter: ApFilter!
    $apartsFilter: ApartFilter!
    $apbersFilter: ApberFilter!
    $apberuebersichtsFilter: ApberuebersichtFilter!
    $assozartFilter: AssozartFilter!
    $beobNichtBeurteiltsFilter: VApbeobFilter
    $beobNichtZuzuordnensFilter: VApbeobFilter
    $beobZugeordnetsFilter: VApbeobFilter!
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
    $isAp: Boolean!
    $isPop: Boolean!
    $isTpop: Boolean!
    $isTpopkontr: Boolean!
    $isWerteListen: Boolean!
    $isZiel: Boolean!
  ) {
    allAps(filter: $apsFilter, orderBy: LABEL_ASC) @include(if: $isProjekt) {
      totalCount
      nodes {
        ...ApFields
        apartsByApId {
          nodes {
            ...ApartFields
          }
        }
      }
    }
    allAparts(filter: $apartsFilter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        ...ApartFields
      }
    }
    allApbers(filter: $apbersFilter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        id
        apId
        jahr
        label
      }
    }
    allApberuebersichts(filter: $apberuebersichtsFilter, orderBy: LABEL_ASC)
      @include(if: $isProjekt) {
      nodes {
        ...ApberuebersichtFields
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
    allVApbeobsNichtBeurteilt: allVApbeobs(filter: $beobNichtBeurteiltsFilter)
      @include(if: $isAp) {
      nodes {
        id
        label
        datum
        autor
        quelle
        apId
      }
    }
    allVApbeobsNichtZuzuordnen: allVApbeobs(
      filter: $beobNichtZuzuordnensFilter
    ) @include(if: $isAp) {
      nodes {
        id
        label
        apId
        artId
      }
    }
    allVApbeobsZugeordnet: allVApbeobs(filter: $beobZugeordnetsFilter)
      @include(if: $isTpop) {
      nodes {
        id
        label
        tpopId
        artId
      }
    }
    allCurrentissues(orderBy: SORT_ASC) {
      nodes {
        ...CurrentIssueFields
      }
    }
    allEkfrequenzs(filter: $ekfrequenzsFilter, orderBy: SORT_ASC)
      @include(if: $isAp) {
      nodes {
        ...EkfrequenzFields
      }
    }
    allEkzaehleinheits(
      filter: $ekzaehleinheitsFilter
      orderBy: [SORT_ASC, LABEL_ASC]
    ) @include(if: $isAp) {
      nodes {
        ...EkzaehleinheitFields
      }
    }
    allErfkrits(filter: $erfkritsFilter, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        ...ErfkritFields
      }
    }
    allMessages {
      totalCount
    }
    allPopbers(filter: $popbersFilter, orderBy: LABEL_ASC)
      @include(if: $isPop) {
      nodes {
        ...PopberFields
      }
    }
    allPopmassnbers(filter: $popmassnbersFilter, orderBy: LABEL_ASC)
      @include(if: $isPop) {
      nodes {
        ...PopmassnberFields
      }
    }
    allPops(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC])
      @include(if: $isAp) {
      nodes {
        ...PopFields
      }
    }
    allProjekts(orderBy: NAME_ASC) {
      nodes {
        ...ProjektFields
      }
    }
    allTpopbers(filter: $tpopbersFilter, orderBy: LABEL_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopberFields
      }
    }
    allTpopfeldkontrs: allTpopkontrs(
      filter: $tpopfeldkontrsFilter
      orderBy: [JAHR_ASC, DATUM_ASC]
    ) @include(if: $isTpop) {
      nodes {
        ...TpopfeldkontrFields
      }
    }
    allTpopfreiwkontrs: allTpopkontrs(
      filter: $tpopfreiwkontrsFilter
      orderBy: [JAHR_ASC, DATUM_ASC]
    ) @include(if: $isTpop) {
      nodes {
        ...TpopfreiwkontrFields
      }
    }
    allTpopkontrzaehls(filter: $tpopkontrzaehlsFilter, orderBy: LABEL_ASC)
      @include(if: $isTpopkontr) {
      nodes {
        ...TpopkontrzaehlFields
      }
    }
    allTpopmassnbers(filter: $tpopmassnbersFilter, orderBy: LABEL_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopmassnberFields
      }
    }
    allTpopmassns(filter: $tpopmassnsFilter, orderBy: DATUM_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopmassnFields
      }
    }
    allTpops(filter: $tpopsFilter, orderBy: [NR_ASC, FLURNAME_ASC])
      @include(if: $isPop) {
      nodes {
        ...TpopFields
      }
    }
    allUsers(filter: $usersFilter, orderBy: LABEL_ASC) {
      nodes {
        ...UserFields
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
    allZielbers(filter: $zielbersFilter, orderBy: LABEL_ASC)
      @include(if: $isZiel) {
      nodes {
        ...ZielberFields
      }
    }
    allZiels(filter: $zielsFilter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        ...ZielFields
      }
    }
  }
  ${ap}
  ${apart}
  ${apberuebersicht}
  ${currentIssue}
  ${ekfrequenz}
  ${ekzaehleinheit}
  ${erfkrit}
  ${popber}
  ${popmassnber}
  ${pop}
  ${projekt}
  ${tpopber}
  ${tpopfeldkontr}
  ${tpopfreiwkontr}
  ${tpopkontrzaehl}
  ${tpopmassnber}
  ${tpopmassn}
  ${tpop}
  ${user}
  ${ekAbrechnungstypWerte}
  ${tpopApberrelevantGrundWerte}
  ${tpopkontrzaehlEinheitWerte}
  ${zielber}
  ${ziel}
`
