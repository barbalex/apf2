import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../../../shared/fragments.ts'

export const createTpopkontrzaehl = gql`
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
