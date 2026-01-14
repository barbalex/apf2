import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../../../shared/fragments.ts'

export const updateTpopkontrzaehlById = gql`
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
