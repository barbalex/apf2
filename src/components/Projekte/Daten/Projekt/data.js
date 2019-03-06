import gql from 'graphql-tag'

import { projekt } from '../../../shared/fragments'

export default gql`
  query projektByIdQuery($id: UUID!) {
    projektById(id: $id) {
      ...ProjektFields
    }
  }
  ${projekt}
`
