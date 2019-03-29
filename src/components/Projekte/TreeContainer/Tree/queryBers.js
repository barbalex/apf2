import gql from 'graphql-tag'

import { ber } from '../../../shared/fragments'

export default gql`
  query BersQuery($ap: [UUID!], $isAp: Boolean!) {
    allBers(filter: { apId: { in: $ap } }, orderBy: JAHR_ASC)
      @include(if: $isAp) {
      nodes {
        ...BerFields
      }
    }
  }
  ${ber}
`
