import gql from 'graphql-tag'

import { popmassnber, tpopmassnErfbeurtWerte } from '../../../shared/fragments'

export default gql`
  query PopmassnbersQuery($pop: [UUID!], $isPop: Boolean!) {
    allPopmassnbers(filter: { popId: { in: $pop } }, orderBy: JAHR_ASC)
      @include(if: $isPop) {
      nodes {
        ...PopmassnberFields
        tpopmassnErfbeurtWerteByBeurteilung {
          ...TpopmassnErfbeurtWerteFields
        }
      }
    }
  }
  ${popmassnber}
  ${tpopmassnErfbeurtWerte}
`
