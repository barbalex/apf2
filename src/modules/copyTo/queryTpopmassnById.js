import gql from 'graphql-tag'

import { tpopmassn } from '../../components/shared/fragments'

export default gql`
  query Query($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
    }
  }
  ${tpopmassn}
`
