import { gql } from '@apollo/client'

import { tpopfeldkontr } from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQueryForEk($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopfeldkontrFields
    }
  }
  ${tpopfeldkontr}
`
