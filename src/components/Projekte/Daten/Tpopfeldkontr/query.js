import gql from 'graphql-tag'

import { adresse, tpopfeldkontr } from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQuery($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopfeldkontrFields
      adresseByBearbeiter {
        ...AdresseFields
      }
    }
  }
  ${adresse}
  ${tpopfeldkontr}
`
