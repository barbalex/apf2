import gql from 'graphql-tag'

import { aeEigenschaften, ap, apart } from '../../../shared/fragments'

export default gql`
  query ApsQuery($isProjekt: Boolean!, $apFilter: ApFilter!) {
    allAps(filter: $apFilter) @include(if: $isProjekt) {
      totalCount
      nodes {
        ...ApFields
        aeEigenschaftenByArtId {
          ...AeEigenschaftenFields
        }
        apartsByApId {
          nodes {
            ...ApartFields
          }
        }
      }
    }
  }
  ${aeEigenschaften}
  ${ap}
  ${apart}
`
