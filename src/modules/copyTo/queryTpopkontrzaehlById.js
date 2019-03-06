import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../components/shared/fragments'

export default gql`
  query Query($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
`
