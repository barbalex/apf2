import gql from 'graphql-tag'

import { popmassnber } from '../../shared/fragments'

export default gql`
  mutation createPopmassnber(
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
