import gql from 'graphql-tag'

export default gql`
  query TpopmassnQuery($tpop: [UUID!], $isTpop: Boolean!) {
    allTpopmassns(filter: { tpopId: { in: $tpop } }, orderBy: JAHR_ASC)
      @include(if: $isTpop) {
      nodes {
        id
        tpopId
        jahr
        typ
        beschreibung
        jahr
        datum
        bearbeiter
        bemerkungen
        planVorhanden
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
        tpopmassnTypWerteByTyp {
          id
          text
        }
      }
    }
  }
`
