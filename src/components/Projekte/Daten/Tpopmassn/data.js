import gql from 'graphql-tag'

import { adresse, tpopmassn } from '../../../shared/fragments'

export default gql`
  query tpopmassnByIdQuery($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
      tpopmassnTypWerteByTyp {
        id
        code
        text
        sort
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
    allTpopmassnTypWertes {
      nodes {
        id
        code
        text
        ansiedlung
        sort
      }
    }
  }
  ${adresse}
  ${tpopmassn}
`
