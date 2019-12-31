import gql from 'graphql-tag'

import { ap, apart } from '../../../shared/fragments'

export default gql`
  query TreeApsQuery($isProjekt: Boolean!, $filter: ApFilter!) {
    allAps(filter: $filter, orderBy: LABEL_ASC) @include(if: $isProjekt) {
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
  }
  ${ap}
  ${apart}
`
