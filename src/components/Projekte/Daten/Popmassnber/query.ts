import { gql as dynamicGql } from '../../../../apolloGql.ts'

import {
  popmassnber,
  tpopmassnErfbeurtWerte,
} from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
