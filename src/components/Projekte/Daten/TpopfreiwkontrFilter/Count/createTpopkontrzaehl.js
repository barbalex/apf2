import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../../shared/fragments'

export default gql`
  mutation createTpopkontrzaehlForCountFilter($tpopkontrId: UUID) {
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
