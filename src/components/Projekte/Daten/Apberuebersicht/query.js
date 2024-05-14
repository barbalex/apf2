import { gql } from '@apollo/client'

import { apberuebersicht } from '../../../shared/fragments.js'

export default gql`
  query apberuebersichtByIdQuery($id: UUID!) {
    apberuebersichtById(id: $id) {
      ...ApberuebersichtFields
    }
  }
  ${apberuebersicht}
`
