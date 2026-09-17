import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { assozart } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query assozartByIdForDelete($id: UUID!) {
    assozartById(id: $id) {
      ...AssozartFields
    }
  }
  ${assozart}
`
