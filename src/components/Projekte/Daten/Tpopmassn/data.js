import gql from 'graphql-tag'

import {
  adresse,
  tpopmassn,
  tpopmassnTypWerte,
} from '../../../shared/fragments'

export default gql`
  query tpopmassnByIdQuery($id: UUID!, $showFilter: Boolean!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
      tpopmassnTypWerteByTyp {
        ...TpopmassnTypWerteFields
      }
      adresseByBearbeiter {
        ...AdresseFields
      }
      tpopByTpopId {
        id
        popByPopId {
          id
          apId
        }
      }
    }
    allTpopmassns @include(if: $showFilter) {
      nodes {
        ...TpopmassnFields
      }
    }
    allTpopmassnTypWertes {
      nodes {
        ...TpopmassnTypWerteFields
      }
    }
  }
  ${adresse}
  ${tpopmassn}
  ${tpopmassnTypWerte}
`
