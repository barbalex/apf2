import gql from 'graphql-tag'

import { tpop } from '../../../shared/fragments'

export default gql`
  query TreeTpopQuery($isPop: Boolean!, $filter: TpopFilter!) {
    allTpops(filter: $filter, orderBy: [NR_ASC, FLURNAME_ASC])
      @include(if: $isPop) {
      nodes {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
