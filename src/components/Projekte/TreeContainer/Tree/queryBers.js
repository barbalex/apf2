import gql from 'graphql-tag'

import { ber } from '../../../shared/fragments'

export default gql`
  query BersQuery($filter: BerFilter!, $isAp: Boolean!) {
    allBers(filter: $filter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        ...BerFields
      }
    }
  }
  ${ber}
`
