import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { pop, popber, tpopEntwicklungWerte } from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
