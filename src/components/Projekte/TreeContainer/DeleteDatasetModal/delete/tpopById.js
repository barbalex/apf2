import gql from 'graphql-tag'

import {tpop} from '../../../../shared/fragments'

export default gql`
  query tpopById($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
    }
  }
  ${tpop}
`
