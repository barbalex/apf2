import gql from 'graphql-tag'

import { ber } from '../../../shared/fragments'

export default gql`
  query berByIdQuery($id: UUID!) {
    berById(id: $id) {
      ...BerFields
    }
  }
  ${ber}
`
