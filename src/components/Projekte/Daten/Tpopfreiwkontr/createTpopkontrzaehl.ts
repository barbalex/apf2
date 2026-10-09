import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpopkontrzaehl } from '../../../shared/fragments.ts'

export const createTpopkontrzaehl = dynamicGql`
  mutation createTpopkontrzaehForEkf($tpopkontrId: UUID, $einheit: Int) {
    createTpopkontrzaehl(
      input: {
        tpopkontrzaehl: { tpopkontrId: $tpopkontrId, einheit: $einheit }
      }
    ) {
      tpopkontrzaehl {
        ...TpopkontrzaehlFields
      }
    }
  }
  ${tpopkontrzaehl}
`
