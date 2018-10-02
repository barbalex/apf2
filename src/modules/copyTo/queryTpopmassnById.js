import gql from 'graphql-tag'

export default gql`
  query Query($id: UUID!) {
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
      bearbeiter
      planVorhanden
    }
  }
`
