import gql from 'graphql-tag'

import { pop, popmassnber } from '../../../shared/fragments'

export default gql`
  mutation updatePopmassnber(
    $id: UUID!
    $popId: UUID
    $jahr: Int
    $beurteilung: Int
    $bemerkungen: String
    $changedBy: String
  ) {
    updatePopmassnberById(
      input: {
        id: $id
        popmassnberPatch: {
          id: $id
          popId: $popId
          jahr: $jahr
          beurteilung: $beurteilung
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      popmassnber {
        ...PopmassnberFields
        tpopmassnErfbeurtWerteByBeurteilung {
          id
          text
        }
        popByPopId {
          ...PopFields
        }
      }
    }
  }
  ${pop}
  ${popmassnber}
`
