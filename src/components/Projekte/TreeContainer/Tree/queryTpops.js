import gql from 'graphql-tag'

import { tpop } from '../../../shared/fragments'

export default gql`
  query TpopQuery($isPop: Boolean!, $tpopFilter: TpopFilter!) {
    allTpops(filter: $tpopFilter, orderBy: [NR_ASC, FLURNAME_ASC])
      @include(if: $isPop) {
      nodes {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
