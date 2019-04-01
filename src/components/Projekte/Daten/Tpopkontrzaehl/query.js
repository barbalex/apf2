import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../../shared/fragments'

export default gql`
  query TpopkontrzaehlQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
`
