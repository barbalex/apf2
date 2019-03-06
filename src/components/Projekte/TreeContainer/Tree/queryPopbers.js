import gql from 'graphql-tag'

import { popber, tpopEntwicklungWerte } from '../../../shared/fragments'

export default gql`
  query PopbersQuery($pop: [UUID!], $isPop: Boolean!) {
    allPopbers(filter: { popId: { in: $pop } }, orderBy: JAHR_ASC)
      @include(if: $isPop) {
      nodes {
        ...PopberFields
        tpopEntwicklungWerteByEntwicklung {
          ...TpopEntwicklungWerteFields
        }
      }
    }
  }
  ${popber}
  ${tpopEntwicklungWerte}
`
