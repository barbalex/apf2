import gql from 'graphql-tag'

import { apberuebersicht } from '../../../shared/fragments'

export default gql`
  query ApberuebersichtQuery($filter: ApberuebersichtFilter!, $isProjekt: Boolean!) {
    allApberuebersichts(
      filter: $filter
      orderBy: LABEL_ASC
    ) @include(if: $isProjekt) {
      nodes {
        ...ApberuebersichtFields
      }
    }
  }
  ${apberuebersicht}
`
