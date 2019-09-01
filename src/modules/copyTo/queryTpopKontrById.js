import gql from 'graphql-tag'

import { tpopkontr } from '../../components/shared/fragments'

export default gql`
  query copyEkToQuery($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopkontrFields
    }
  }
  ${tpopkontr}
`
