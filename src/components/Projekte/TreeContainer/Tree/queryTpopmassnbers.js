import gql from 'graphql-tag'

import { tpopmassnber, tpopmassnErfbeurtWerte } from '../../../shared/fragments'

export default gql`
  query TpopmassnbersQuery($tpop: [UUID!], $isTpop: Boolean!) {
    allTpopmassnbers(filter: { tpopId: { in: $tpop } }, orderBy: JAHR_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopmassnberFields
        tpopmassnErfbeurtWerteByBeurteilung {
          ...TpopmassnErfbeurtWerteFields
        }
      }
    }
  }
  ${tpopmassnber}
  ${tpopmassnErfbeurtWerte}
`
