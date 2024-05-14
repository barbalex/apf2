import { gql } from '@apollo/client'

import { tpopkontr } from '../../components/shared/fragments.js'

export default gql`
  query copyEkToQueryForEk2($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopkontrFields
    }
  }
  ${tpopkontr}
`
