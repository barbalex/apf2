import gql from 'graphql-tag'

import { ziel } from '../../../shared/fragments'

export default gql`
  query zielByIdQuery($id: UUID!) {
    zielById(id: $id) {
      ...ZielFields
    }
    allZielTypWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
  ${ziel}
`
