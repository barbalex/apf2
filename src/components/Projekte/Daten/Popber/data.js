import gql from 'graphql-tag'

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
    allTpopEntwicklungWertes {
      nodes {
        ...TpopEntwicklungWerteFields
      }
    }
  }
  ${pop}
  ${popber}
  ${tpopEntwicklungWerte}
`
