import gql from 'graphql-tag'

import { adresse, apber } from '../../../shared/fragments'

export default gql`
  query apberByIdQuery($id: UUID!) {
    apberById(id: $id) {
      ...ApberFields
      apErfkritWerteByBeurteilung {
        id
        code
        text
        sort
      }
      adresseByBearbeiter {
        ...AdresseFields
      }
    }
  }
  ${adresse}
  ${apber}
`
