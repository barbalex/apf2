import { gql } from '@apollo/client'

import { pop, popber, tpopEntwicklungWerte } from '../../../shared/fragments'

export default gql`
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
  }
  ${pop}
  ${popber}
  ${tpopEntwicklungWerte}
`
