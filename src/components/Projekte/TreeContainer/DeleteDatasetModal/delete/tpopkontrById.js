import gql from 'graphql-tag'

import { tpopkontr } from '../../../../shared/fragments'

export default gql`
  query tpopkontrByIdForDelete($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopkontrFields
    }
  }
  ${tpopkontr}
`
