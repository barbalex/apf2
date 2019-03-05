import gql from 'graphql-tag'

import { aeEigenschaften } from '../../../shared/fragments'

export default gql`
  query ApartsQuery($ap: [UUID!], $isAp: Boolean!) {
    allAparts(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        id
        apId
        aeEigenschaftenByArtId {
          ...AeEigenschaftenFields
        }
      }
    }
  }
  ${aeEigenschaften}
`
