import gql from 'graphql-tag'

import { ap, adresse, aeEigenschaften } from '../../../shared/fragments'

export default gql`
  query apByIdQuery($id: UUID!) {
    apById(id: $id) {
      ...ApFields
      adresseByBearbeiter {
        ...AdresseFields
      }
      aeEigenschaftenByArtId {
        ...AeEigenschaftenFields
      }
    }
    allApBearbstandWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
    allApUmsetzungWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
  ${ap}
  ${adresse}
  ${aeEigenschaften}
`
