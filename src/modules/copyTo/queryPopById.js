import gql from 'graphql-tag'

import { pop } from '../../components/shared/fragments'

export default gql`
  query Query($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
`
