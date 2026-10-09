import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { popmassnber } from '../../../shared/fragments.ts'

export default dynamicGql`
  mutation createPopmassnberForUndelete(
    $id: UUID
    $popId: UUID
    $jahr: Int
    $beurteilung: Int
    $bemerkungen: String
  ) {
    createPopmassnber(
      input: {
        popmassnber: {
          id: $id
          popId: $popId
          jahr: $jahr
          beurteilung: $beurteilung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      popmassnber {
        ...PopmassnberFields
      }
    }
  }
  ${popmassnber}
`
