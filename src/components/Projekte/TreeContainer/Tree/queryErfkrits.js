import gql from 'graphql-tag'

import { erfkrit } from '../../../shared/fragments'

export default gql`
  query ErfkritsQuery($ap: [UUID!], $isAp: Boolean!) {
    allErfkrits(filter: { apId: { in: $ap } }, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        ...ErfkritFields
      }
    }
  }
  ${erfkrit}
`
