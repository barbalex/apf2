import gql from 'graphql-tag'

import { aeEigenschaften, apart } from '../../../shared/fragments'

export default gql`
  query apartByIdQuery($id: UUID!) {
    apartById(id: $id) {
      ...ApartFields
      aeEigenschaftenByArtId {
        ...AeEigenschaftenFields
      }
    }
  }
  ${aeEigenschaften}
  ${apart}
`
