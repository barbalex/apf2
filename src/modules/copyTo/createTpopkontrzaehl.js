import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../components/shared/fragments'

export default gql`
  mutation createTpopkontrzaehlForCopyTo(
    $anzahl: Int
    $einheit: Int
    $methode: Int
    $tpopkontrId: UUID
  ) {
    createTpopkontrzaehl(
      input: {
        tpopkontrzaehl: {
          tpopkontrId: $tpopkontrId
          anzahl: $anzahl
          einheit: $einheit
          methode: $methode
        }
      }
    ) {
      tpopkontrzaehl {
        ...TpopkontrzaehlFields
      }
    }
  }
  ${tpopkontrzaehl}
`
