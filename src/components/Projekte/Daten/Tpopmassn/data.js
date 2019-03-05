import gql from 'graphql-tag'

import { adresse } from '../../../shared/fragments'

export default gql`
  query tpopmassnByIdQuery($id: UUID!) {
    tpopmassnById(id: $id) {
      id
      typ
      tpopmassnTypWerteByTyp {
        id
        code
        text
        sort
      }
      beschreibung
      jahr
      datum
      bemerkungen
      planBezeichnung
      flaeche
      markierung
      anzTriebe
      anzPflanzen
      anzPflanzstellen
      wirtspflanze
      herkunftPop
      sammeldatum
      form
      pflanzanordnung
      tpopId
      bearbeiter
      adresseByBearbeiter {
        ...AdresseFields
      }
      planVorhanden
      tpopByTpopId {
        id
        popByPopId {
          id
          apId
        }
      }
    }
    allTpopmassnTypWertes {
      nodes {
        id
        code
        text
        ansiedlung
        sort
      }
    }
  }
  ${adresse}
`
