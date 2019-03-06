import gql from 'graphql-tag'

import {
  ap,
  adresse,
  aeEigenschaften,
  apBearbstandWerte,
} from '../../../shared/fragments'

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
        ...ApBearbstandWerteFields
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
  ${apBearbstandWerte}
`
