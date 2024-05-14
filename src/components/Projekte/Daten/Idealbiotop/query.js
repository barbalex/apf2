import { gql } from '@apollo/client'

import { idealbiotop } from '../../../shared/fragments.js'

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
