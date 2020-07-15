import { gql } from '@apollo/client'

import { pop } from '../../components/shared/fragments'

export default gql`
  query copyPopToQuery($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
`
