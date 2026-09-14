import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { tpopkontrzaehl } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query tpopkontrzaehlByIdForDelete($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
`
