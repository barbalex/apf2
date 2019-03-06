import gql from 'graphql-tag'

import { apberuebersicht, projekt } from '../../shared/fragments'

export default gql`
  query apberuebersichtById($apberuebersichtId: UUID!) {
    apberuebersichtById(id: $apberuebersichtId) {
      ...ApberuebersichtFields
      projektByProjId {
        ...ProjektFields
      }
    }
  }
  ${apberuebersicht}
  ${projekt}
`
