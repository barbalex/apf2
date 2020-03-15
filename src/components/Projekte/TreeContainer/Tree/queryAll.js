import gql from 'graphql-tag'

import { ap, apart, apberuebersicht } from '../../../shared/fragments'

export default gql`
  query TreeAllQuery(
    $apsFilter: ApFilter!
    $apartsFilter: ApartFilter!
    $apbersFilter: ApberFilter!
    $apberuebersichtsFilter: ApberuebersichtFilter!
    $assozartFilter: AssozartFilter!
    $beobNichtBeurteiltsFilter: VApbeobFilter
    $beobNichtZuzuordnensFilter: VApbeobFilter
    $isAp: Boolean!
    $isProjekt: Boolean!
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
  }
  ${ap}
  ${apart}
  ${apberuebersicht}
`
