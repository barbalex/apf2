import gql from 'graphql-tag'

import { adresse } from '../../../../shared/fragments'

export default gql`
  query ekfDataWithDateByAdresseIdForAppbarQuery($id: UUID!) {
    adresseById(id: $id) {
      ...AdresseFields
    }
  }
  ${adresse}
`
