import gql from 'graphql-tag'

import { popmassnber } from '../../../shared/fragments'

export default gql`
  query popmassnberByIdQuery($id: UUID!) {
    popmassnberById(id: $id) {
      ...PopmassnberFields
      tpopmassnErfbeurtWerteByBeurteilung {
        id
        text
      }
      popByPopId {
        id
        apId
      }
    }
  }
  ${popmassnber}
`
