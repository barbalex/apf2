import gql from 'graphql-tag'

import {
  ekfzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

export default gql`
  query EkfzaehleinheitsQuery($ap: [UUID!], $isAp: Boolean!) {
    allEkfzaehleinheits(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        ...EkfzaehleinheitFields
        tpopkontrzaehlEinheitWerteByZaehleinheitId {
          ...TpopkontrzaehlEinheitWerteFields
        }
      }
    }
  }
  ${ekfzaehleinheit}
  ${tpopkontrzaehlEinheitWerte}
`
