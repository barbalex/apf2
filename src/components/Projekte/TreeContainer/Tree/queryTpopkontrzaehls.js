import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../../shared/fragments'

export default gql`
  query TpopkontrzaehlsQuery($tpopkontr: [UUID!], $isTpopkontr: Boolean!) {
    allTpopkontrzaehls(
      filter: { tpopkontrId: { in: $tpopkontr } }
      orderBy: LABEL_ASC
    ) @include(if: $isTpopkontr) {
      nodes {
        ...TpopkontrzaehlFields
      }
    }
  }
  ${tpopkontrzaehl}
`
