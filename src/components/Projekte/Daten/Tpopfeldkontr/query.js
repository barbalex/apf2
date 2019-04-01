import gql from 'graphql-tag'

import { tpopfeldkontr } from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQuery($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopfeldkontrFields
    }
  }
  ${tpopfeldkontr}
`
