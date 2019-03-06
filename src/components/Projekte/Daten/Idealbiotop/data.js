import gql from 'graphql-tag'

import { idealbiotop } from '../../../shared/fragments'

export default gql`
  query idealbiotopByIdQuery($id: UUID!) {
    allIdealbiotops(filter: { apId: { equalTo: $id } }) {
      nodes {
        ...IdealbiotopFields
      }
    }
  }
  ${idealbiotop}
`
