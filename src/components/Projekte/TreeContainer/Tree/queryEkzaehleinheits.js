import gql from 'graphql-tag'

import { ekzaehleinheit } from '../../../shared/fragments'

export default gql`
  query EkzaehleinheitsQuery($filter: EkzaehleinheitFilter!, $isAp: Boolean!) {
    allEkzaehleinheits(filter: $filter, orderBy: [SORT_ASC, LABEL_ASC])
      @include(if: $isAp) {
      nodes {
        ...EkzaehleinheitFields
      }
    }
  }
  ${ekzaehleinheit}
`
