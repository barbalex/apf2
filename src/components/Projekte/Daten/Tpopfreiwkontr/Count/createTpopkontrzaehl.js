import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../../../shared/fragments'

export default gql`
  mutation createTpopkontrzaehl($tpopkontrId: UUID) {
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
