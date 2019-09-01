import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../components/shared/fragments'

export default gql`
  query copyEkZaehlToQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
`
