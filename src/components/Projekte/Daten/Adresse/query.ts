import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { adresse } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query adresseByIdForAdresse($id: UUID!) {
    adresseById(id: $id) {
      ...AdresseFields
    }
  }
  ${adresse}
`
