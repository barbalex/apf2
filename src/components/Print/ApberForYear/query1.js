import gql from 'graphql-tag'

import { apberuebersicht } from '../../shared/fragments'

export default gql`
  query apberuebersichtById($apberuebersichtId: UUID!) {
    apberuebersichtById(id: $apberuebersichtId) {
      ...ApberuebersichtFields
    }
  }
  ${apberuebersicht}
`
