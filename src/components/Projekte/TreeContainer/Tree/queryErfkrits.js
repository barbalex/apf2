import gql from 'graphql-tag'

import { erfkrit } from '../../../shared/fragments'

export default gql`
  query ErfkritsQuery($filter: ErfkritFilter!, $isAp: Boolean!) {
    allErfkrits(filter: $filter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        ...ErfkritFields
      }
    }
  }
  ${erfkrit}
`
