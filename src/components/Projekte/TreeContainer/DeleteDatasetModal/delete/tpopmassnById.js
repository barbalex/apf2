import gql from 'graphql-tag'

export default gql`
  query tpopmassnById($id: UUID!) {
    tpopmassnById(id: $id) {
      id
      typ
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
      planVorhanden
    }
  }
`
