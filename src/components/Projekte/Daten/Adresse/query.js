import { gql } from '@apollo/client'

import { adresse } from '../../../shared/fragments'

export default gql`
  query adresseByIdForAdresse($id: UUID!) {
    adresseById(id: $id) {
      ...AdresseFields
    }
  }
  ${adresse}
`
