import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../../shared/fragments.js'

export default gql`
  mutation updateAnzahlForCount(
    $id: UUID!
    $anzahl: Float
    $einheit: Int
    $methode: Int
  ) {
    updateTpopkontrzaehlById(
      input: {
        id: $id
        tpopkontrzaehlPatch: {
          id: $id
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
