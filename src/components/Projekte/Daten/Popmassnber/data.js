import gql from 'graphql-tag'

import { popmassnber, tpopmassnErfbeurtWerte } from '../../../shared/fragments'

export default gql`
  query popmassnberByIdQuery($id: UUID!) {
    popmassnberById(id: $id) {
      ...PopmassnberFields
      tpopmassnErfbeurtWerteByBeurteilung {
        ...TpopmassnErfbeurtWerteFields
      }
      popByPopId {
        id
        apId
      }
    }
  }
  ${popmassnber}
  ${tpopmassnErfbeurtWerte}
`
