import { gql } from '@apollo/client'

import { apberuebersicht } from '../../../../shared/fragments'

export default gql`
  query apberuebersichtByIdForDelete($id: UUID!) {
    apberuebersichtById(id: $id) {
      ...ApberuebersichtFields
    }
  }
  ${apberuebersicht}
`
