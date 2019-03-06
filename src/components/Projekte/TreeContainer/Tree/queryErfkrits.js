import gql from 'graphql-tag'

import { apErfkritWerte } from '../../../shared/fragments'

export default gql`
  query ErfkritsQuery($ap: [UUID!], $isAp: Boolean!) {
    allErfkrits(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        id
        apId
        kriterien
        erfolg
        apErfkritWerteByErfolg {
          ...ApErfkritWerteFields
        }
      }
    }
  }
  ${apErfkritWerte}
`
