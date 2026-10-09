import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { erfkrit } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query erfkritByIdForDelete($id: UUID!) {
    erfkritById(id: $id) {
      ...ErfkritFields
    }
  }
  ${erfkrit}
`
