import gql from 'graphql-tag'

import { ap, aeEigenschaften } from '../../../shared/fragments'

export default gql`
  query apByIdQuery($id: UUID!) {
    apById(id: $id) {
      ...ApFields
      aeEigenschaftenByArtId {
        ...AeEigenschaftenFields
      }
    }
  }
  ${ap}
  ${aeEigenschaften}
`
