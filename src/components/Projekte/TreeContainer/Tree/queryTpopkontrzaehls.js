import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../../shared/fragments'

export default gql`
  query TpopkontrzaehlsQuery(
    $filter: TpopkontrzaehlFilter!
    $isTpopkontr: Boolean!
  ) {
    allTpopkontrzaehls(filter: $filter, orderBy: LABEL_ASC)
      @include(if: $isTpopkontr) {
      nodes {
        ...TpopkontrzaehlFields
      }
    }
  }
  ${tpopkontrzaehl}
`
