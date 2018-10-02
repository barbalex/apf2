import gql from 'graphql-tag'

export default gql`
  mutation createTpopmassn(
    $typ: Int
    $beschreibung: String
    $jahr: Int
    $datum: Date
    $bemerkungen: String
    $planBezeichnung: String
    $flaeche: Int
    $markierung: String
    $anzTriebe: Int
    $anzPflanzen: Int
    $anzPflanzstellen: Int
    $wirtspflanze: String
    $herkunftPop: String
    $sammeldatum: String
    $form: String
    $pflanzanordnung: String
    $tpopId: UUID
    $bearbeiter: UUID
    $planVorhanden: Boolean
  ) {
    createTpopmassn(
      input: {
        tpopmassn: {
          typ: $typ
          beschreibung: $beschreibung
          jahr: $jahr
          datum: $datum
          bemerkungen: $bemerkungen
          planBezeichnung: $planBezeichnung
          flaeche: $flaeche
          markierung: $markierung
          anzTriebe: $anzTriebe
          anzPflanzen: $anzPflanzen
          anzPflanzstellen: $anzPflanzstellen
          wirtspflanze: $wirtspflanze
          herkunftPop: $herkunftPop
          sammeldatum: $sammeldatum
          form: $form
          pflanzanordnung: $pflanzanordnung
          tpopId: $tpopId
          bearbeiter: $bearbeiter
          planVorhanden: $planVorhanden
        }
      }
    ) {
      tpopmassn {
        id
        tpopId
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
  }
`
