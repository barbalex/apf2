import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpopkontrzaehl } from '../../../shared/fragments.ts'

export default dynamicGql`
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
