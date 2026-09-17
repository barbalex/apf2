import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { tpopkontr } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query tpopkontrByIdForDelete($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopkontrFields
    }
  }
  ${tpopkontr}
`
