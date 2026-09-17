import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { tpopkontrzaehl } from '../../../../../shared/fragments.ts'

export const updateTpopkontrzaehlById = dynamicGql`
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
