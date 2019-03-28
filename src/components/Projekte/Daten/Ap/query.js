import gql from 'graphql-tag'

import {
  ap,
  adresse,
  aeEigenschaften,
  apBearbstandWerte,
  apUmsetzungWerte,
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
        ...ApUmsetzungWerteFields
      }
    }
  }
  ${ap}
  ${adresse}
  ${aeEigenschaften}
  ${apBearbstandWerte}
  ${apUmsetzungWerte}
`
