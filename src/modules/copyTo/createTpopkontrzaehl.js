import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../components/shared/fragments.js'

export const createTpopkontrzaehl = gql`
  mutation createTpopkontrzaehlForCopyTo(
    $anzahl: Float
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
