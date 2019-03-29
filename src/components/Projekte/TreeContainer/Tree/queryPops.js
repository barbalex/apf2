import gql from 'graphql-tag'

import { pop } from '../../../shared/fragments'

export default gql`
  query PopsQuery($isAp: Boolean!, $popFilter: PopFilter!) {
    allPops(filter: $popFilter, orderBy: NR_ASC) @include(if: $isAp) {
      nodes {
        ...PopFields
        apByApId {
          id
          bearbeitung
        }
      }
    }
  }
  ${pop}
`
