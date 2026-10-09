import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { projekt } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query projektByIdForDelete($id: UUID!) {
    projektById(id: $id) {
      ...ProjektFields
    }
  }
  ${projekt}
`
