import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../../shared/fragments'

export default gql`
  mutation createTpopkontrzaehl($tpopkontrId: UUID, $einheit: Int) {
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
