import { gql } from '@apollo/client'

import { pop } from '../../components/shared/fragments.js'

export default gql`
  query copyPopToQuery($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
`
