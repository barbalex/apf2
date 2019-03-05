import gql from 'graphql-tag'

import { ber } from '../../../../shared/fragments'

export default gql`
  query berById($id: UUID!) {
    berById(id: $id) {
      ...BerFields
    }
  }
  ${ber}
`
