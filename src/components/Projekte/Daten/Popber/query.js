import { gql } from '@apollo/client'

import { pop, popber, tpopEntwicklungWerte } from '../../../shared/fragments.js'

export const query = gql`
  query popberByIdQuery($id: UUID!) {
    popberById(id: $id) {
      ...PopberFields
      tpopEntwicklungWerteByEntwicklung {
        ...TpopEntwicklungWerteFields
      }
      popByPopId {
        ...PopFields
      }
    }
    allTpopEntwicklungWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
  ${pop}
  ${popber}
  ${tpopEntwicklungWerte}
`
