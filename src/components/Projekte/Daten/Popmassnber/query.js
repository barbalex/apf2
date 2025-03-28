import { gql } from '@apollo/client'

import {
  popmassnber,
  tpopmassnErfbeurtWerte,
} from '../../../shared/fragments.js'

export const query = gql`
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
    allTpopmassnErfbeurtWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
  ${popmassnber}
  ${tpopmassnErfbeurtWerte}
`
