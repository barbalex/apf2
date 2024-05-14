import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../shared/fragments.js'

export default gql`
  mutation createTpopkontrzaehlForUndelete(
    $id: UUID
    $anzahl: Float
    $einheit: Int
    $methode: Int
    $tpopkontrId: UUID
  ) {
    createTpopkontrzaehl(
      input: {
        tpopkontrzaehl: {
          id: $id
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
