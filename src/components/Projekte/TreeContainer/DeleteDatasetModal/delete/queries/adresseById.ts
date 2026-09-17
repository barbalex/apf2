import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { adresse } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query adresseByIdForDelete($id: UUID!) {
    adresseById(id: $id) {
      ...AdresseFields
    }
  }
  ${adresse}
`
