import { gql } from '@apollo/client'

import { pop, popber, tpopEntwicklungWerte } from '../../../shared/fragments'

export default gql`
  mutation updatePopber(
    $id: UUID!
    $popId: UUID
    $jahr: Int
    $entwicklung: Int
    $bemerkungen: String
    $changedBy: String
  ) {
    updatePopberById(
      input: {
        id: $id
        popberPatch: {
          id: $id
          popId: $popId
          jahr: $jahr
          entwicklung: $entwicklung
          bemerkungen: $bemerkungen
          changedBy: $changedBy
        }
      }
    ) {
      popber {
        ...PopberFields
        tpopEntwicklungWerteByEntwicklung {
          ...TpopEntwicklungWerteFields
        }
        popByPopId {
          ...PopFields
        }
      }
    }
  }
  ${pop}
  ${popber}
  ${tpopEntwicklungWerte}
`
