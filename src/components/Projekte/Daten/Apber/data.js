import gql from 'graphql-tag'

import { adresse } from '../../../shared/fragments'

export default gql`
  query apberByIdQuery($id: UUID!) {
    apberById(id: $id) {
      id
      jahr
      situation
      vergleichVorjahrGesamtziel
      beurteilung
      veraenderungZumVorjahr
      apberAnalyse
      konsequenzenUmsetzung
      konsequenzenErfolgskontrolle
      biotopeNeue
      biotopeOptimieren
      massnahmenOptimieren
      wirkungAufArt
      datum
      massnahmenApBearb
      massnahmenPlanungVsAusfuehrung
      apId
      bearbeiter
      apErfkritWerteByBeurteilung {
        id
        code
        text
        sort
      }
      adresseByBearbeiter {
        ...AdresseFields
      }
    }
  }
  ${adresse}
`
