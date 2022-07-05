import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../../shared/fragments'

export default gql`
  mutation updateAnzahlForCountFilter(
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
