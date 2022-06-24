import { gql } from '@apollo/client'

export default gql`
  query tpopmassnByIdQuery($id: UUID!) {
    tpopmassnById(id: $id) {
      id
      label
      typ
      tpopmassnTypWerteByTyp {
        id
        anpflanzung
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
      zieleinheitEinheit
      zieleinheitAnzahl
      wirtspflanze
      herkunftPop
      sammeldatum
      vonAnzahlIndividuen
      form
      pflanzanordnung
      tpopId
      bearbeiter
      planVorhanden
      changedBy
      tpopByTpopId {
        id
        popByPopId {
          id
          apByApId {
            id
            ekzaehleinheitsByApId(filter: { zielrelevant: { equalTo: true } }) {
              nodes {
                id
                zielrelevant
                notMassnCountUnit
              }
            }
          }
        }
      }
    }
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
    allTpopmassnTypWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
        historic
      }
    }
    allTpopkontrzaehlEinheitWertes(orderBy: SORT_ASC) {
      nodes {
        id
        value: code
        label: text
        historic
      }
    }
  }
`
