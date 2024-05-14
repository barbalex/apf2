import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../shared/fragments.js'

export default gql`
  mutation createTpopkontrzaehForEkfFilter($tpopkontrId: UUID, $einheit: Int) {
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
