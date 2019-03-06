import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../../shared/fragments'

export default gql`
  mutation updateAnzahl(
    $id: UUID!
    $anzahl: Int
    $einheit: Int
    $methode: Int
    $changedBy: String
  ) {
    updateTpopkontrzaehlById(
      input: {
        id: $id
        tpopkontrzaehlPatch: {
          id: $id
          anzahl: $anzahl
          einheit: $einheit
          methode: $methode
          changedBy: $changedBy
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
