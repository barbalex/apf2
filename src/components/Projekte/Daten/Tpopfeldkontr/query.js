import gql from 'graphql-tag'

import { adresse, pop, tpopfeldkontr } from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQuery($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopfeldkontrFields
      adresseByBearbeiter {
        ...AdresseFields
      }
      tpopByTpopId {
        id
        popByPopId {
          ...PopFields
        }
      }
    }
  }
  ${adresse}
  ${pop}
  ${tpopfeldkontr}
`
