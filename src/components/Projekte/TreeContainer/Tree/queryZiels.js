import gql from 'graphql-tag'

import { ziel } from '../../../shared/fragments'

export default gql`
  query ZielsQuery($ap: [UUID!], $isAp: Boolean!) {
    allZiels(filter: { apId: { in: $ap } }, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        ...ZielFields
      }
    }
  }
  ${ziel}
`
