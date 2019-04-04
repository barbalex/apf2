import gql from 'graphql-tag'

import { apberuebersicht } from '../../../shared/fragments'

export default gql`
  query ApberuebersichtQuery($projekt: [UUID!], $isProjekt: Boolean!) {
    allApberuebersichts(
      filter: { projId: { in: $projekt } }
      orderBy: LABEL_ASC
    ) @include(if: $isProjekt) {
      nodes {
        ...ApberuebersichtFields
      }
    }
  }
  ${apberuebersicht}
`
