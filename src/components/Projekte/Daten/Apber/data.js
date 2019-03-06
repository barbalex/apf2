import gql from 'graphql-tag'

import { adresse, apber, apErfkritWerte } from '../../../shared/fragments'

export default gql`
  query apberByIdQuery($id: UUID!) {
    apberById(id: $id) {
      ...ApberFields
      apErfkritWerteByBeurteilung {
        ...ApErfkritWerteFields
      }
      adresseByBearbeiter {
        ...AdresseFields
      }
    }
  }
  ${adresse}
  ${apber}
  ${apErfkritWerte}
`
