import { gql } from '@apollo/client'

import { apberuebersicht } from '../../../shared/fragments.ts'

export const query = gql`
  query apberuebersichtByIdQuery($id: UUID!) {
    apberuebersichtById(id: $id) {
      ...ApberuebersichtFields
    }
  }
  ${apberuebersicht}
`
