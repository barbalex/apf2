import gql from 'graphql-tag'

import { pop } from '../../../shared/fragments'

export default gql`
  query TreePopsQuery($isAp: Boolean!, $filter: PopFilter!) {
    allPops(filter: $filter, orderBy: [NR_ASC, NAME_ASC]) @include(if: $isAp) {
      nodes {
        ...PopFields
      }
    }
  }
  ${pop}
`
