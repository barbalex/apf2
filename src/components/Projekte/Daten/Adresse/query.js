import { gql } from '@apollo/client'

import { adresse } from '../../../shared/fragments.js'

export const query = gql`
  query adresseByIdForAdresse($id: UUID!) {
    adresseById(id: $id) {
      ...AdresseFields
    }
  }
  ${adresse}
`
