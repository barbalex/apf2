import gql from 'graphql-tag'

import { ziel, zielTypWerte } from '../../../shared/fragments'

export default gql`
  query ZielsQuery($ap: [UUID!], $isAp: Boolean!) {
    allZiels(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        ...ZielFields
        zielTypWerteByTyp {
          ...ZielTypWerteFields
        }
      }
    }
  }
  ${ziel}
  ${zielTypWerte}
`
