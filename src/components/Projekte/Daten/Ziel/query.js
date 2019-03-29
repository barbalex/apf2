import gql from 'graphql-tag'

import { ziel, zielTypWerte } from '../../../shared/fragments'

export default gql`
  query zielByIdQuery($id: UUID!) {
    zielById(id: $id) {
      ...ZielFields
    }
    allZielTypWertes {
      nodes {
        ...ZielTypWerteFields
      }
    }
  }
  ${ziel}
  ${zielTypWerte}
`
