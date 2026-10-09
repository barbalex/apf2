import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { tpopkontrzaehl } from '../../../../../shared/fragments.ts'

export const createTpopkontrzaehl = dynamicGql`
  mutation createTpopkontrzaehlForCount($tpopkontrId: UUID) {
    createTpopkontrzaehl(
      input: { tpopkontrzaehl: { tpopkontrId: $tpopkontrId } }
    ) {
      tpopkontrzaehl {
        ...TpopkontrzaehlFields
      }
    }
  }
  ${tpopkontrzaehl}
`
