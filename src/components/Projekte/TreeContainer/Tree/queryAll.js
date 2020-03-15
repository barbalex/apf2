import gql from 'graphql-tag'

import { ap, apart, apberuebersicht } from '../../../shared/fragments'

export default gql`
  query TreeAllQuery(
    $apsFilter: ApFilter!
    $apartsFilter: ApartFilter!
    $apbersFilter: ApberFilter!
    $apberuebersichtsFilter: ApberuebersichtFilter!
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
  }
  ${ap}
  ${apart}
  ${apberuebersicht}
`
