import gql from 'graphql-tag'

import { pop } from '../../../shared/fragments'

export default gql`
  query PopsQuery($isAp: Boolean!, $popFilter: PopFilter!) {
    allPops(filter: $popFilter, orderBy: [NR_ASC, NAME_ASC])
      @include(if: $isAp) {
      nodes {
        ...PopFields
      }
    }
  }
  ${pop}
`
