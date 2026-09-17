import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { idealbiotop } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query idealbiotopByIdQuery($id: UUID!) {
    allIdealbiotops(filter: { apId: { equalTo: $id } }) {
      nodes {
        ...IdealbiotopFields
      }
    }
  }
  ${idealbiotop}
`
