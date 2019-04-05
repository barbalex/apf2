import gql from 'graphql-tag'

import { ekfzaehleinheit } from '../../../shared/fragments'

export default gql`
  query EkfzaehleinheitsQuery(
    $filter: EkfzaehleinheitFilter!
    $isAp: Boolean!
  ) {
    allEkfzaehleinheits(filter: $filter, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        ...EkfzaehleinheitFields
      }
    }
  }
  ${ekfzaehleinheit}
`
