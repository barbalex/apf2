import { gql } from '@apollo/client'

import { adresse } from '../../../../../shared/fragments'

export default gql`
  query adresseByIdForDelete($id: UUID!) {
    adresseById(id: $id) {
      ...AdresseFields
    }
  }
  ${adresse}
`
