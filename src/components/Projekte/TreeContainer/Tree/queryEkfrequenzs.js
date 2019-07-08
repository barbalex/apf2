import gql from 'graphql-tag'

import { ekfrequenz } from '../../../shared/fragments'

export default gql`
  query EkfrequenzsQuery($filter: EkfrequenzFilter!, $isAp: Boolean!) {
    allEkfrequenzs(filter: $filter, orderBy: SORT_ASC) @include(if: $isAp) {
      nodes {
        ...EkfrequenzFields
      }
    }
  }
  ${ekfrequenz}
`
