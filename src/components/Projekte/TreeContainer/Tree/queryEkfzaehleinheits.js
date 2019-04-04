import gql from 'graphql-tag'

import { ekfzaehleinheit } from '../../../shared/fragments'

export default gql`
  query EkfzaehleinheitsQuery($ap: [UUID!], $isAp: Boolean!) {
    allEkfzaehleinheits(filter: { apId: { in: $ap } }, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        ...EkfzaehleinheitFields
      }
    }
  }
  ${ekfzaehleinheit}
`
