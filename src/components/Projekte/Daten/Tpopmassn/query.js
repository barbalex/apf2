import gql from 'graphql-tag'

import {
  adresse,
  tpopmassn,
  tpopmassnTypWerte,
} from '../../../shared/fragments'

export default gql`
  query tpopmassnByIdQuery($id: UUID!) {
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
  }
  ${adresse}
  ${tpopmassn}
  ${tpopmassnTypWerte}
`
