import gql from 'graphql-tag'

import { pop, popber } from '../../../shared/fragments'

export default gql`
  query popberByIdQuery($id: UUID!) {
    popberById(id: $id) {
      ...PopberFields
      tpopEntwicklungWerteByEntwicklung {
        id
        code
        text
        sort
      }
      popByPopId {
        ...PopFields
      }
    }
    allTpopEntwicklungWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
  ${pop}
  ${popber}
`
