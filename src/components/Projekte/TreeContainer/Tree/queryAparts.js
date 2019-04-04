import gql from 'graphql-tag'

import { apart } from '../../../shared/fragments'

export default gql`
  query ApartsQuery($ap: [UUID!], $isAp: Boolean!) {
    allAparts(filter: { apId: { in: $ap } }, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        ...ApartFields
      }
    }
  }
  ${apart}
`
