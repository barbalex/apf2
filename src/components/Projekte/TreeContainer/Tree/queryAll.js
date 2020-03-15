import gql from 'graphql-tag'

import {
  ap,
  apart,
  apberuebersicht,
  ber,
  currentIssue,
  ekfrequenz,
  ekzaehleinheit,
  erfkrit,
  popber,
  popmassnber,
  pop,
  projekt,
} from '../../../shared/fragments'

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
    $bersFilter: BerFilter!
    $ekfrequenzsFilter: EkfrequenzFilter!
    $ekzaehleinheitsFilter: EkzaehleinheitFilter!
    $erfkritsFilter: ErfkritFilter!
    $popbersFilter: PopberFilter!
    $popmassnbersFilter: PopmassnberFilter!
    $popsFilter: PopFilter!
    $isProjekt: Boolean!
    $isAp: Boolean!
    $isPop: Boolean!
    $isTpop: Boolean!
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
    allBers(filter: $bersFilter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        ...BerFields
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
  }
  ${ap}
  ${apart}
  ${apberuebersicht}
  ${ber}
  ${currentIssue}
  ${ekfrequenz}
  ${ekzaehleinheit}
  ${erfkrit}
  ${popber}
  ${popmassnber}
  ${pop}
  ${projekt}
`
