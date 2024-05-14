import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../../shared/fragments.js'

export default gql`
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
