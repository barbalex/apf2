import gql from 'graphql-tag'

import { apberuebersicht } from '../../../shared/fragments'

export default gql`
  query apberuebersichtByIdQuery($id: UUID!) {
    apberuebersichtById(id: $id) {
      ...AberuebersichtFields
    }
  }
  ${apberuebersicht}
`
