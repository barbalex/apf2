import { gql } from '@apollo/client'

import { tpopmassn } from '../../components/shared/fragments'

export default gql`
  mutation createTpopmassn(
    $typ: Int
    $beschreibung: String
    $jahr: Int
    $datum: Date
    $bemerkungen: String
    $planBezeichnung: String
    $flaeche: Float
    $markierung: String
    $anzTriebe: Int
    $anzPflanzen: Int
    $anzPflanzstellen: Int
    $zieleinheitEinheit: Int
    $zieleinheitAnzahl: Int
    $wirtspflanze: String
    $herkunftPop: String
    $sammeldatum: String
    $vonAnzahlIndividuen: Int
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
          zieleinheitEinheit: $zieleinheitEinheit
          zieleinheitAnzahl: $zieleinheitAnzahl
          wirtspflanze: $wirtspflanze
          herkunftPop: $herkunftPop
          sammeldatum: $sammeldatum
          vonAnzahlIndividuen: $vonAnzahlIndividuen
          form: $form
          pflanzanordnung: $pflanzanordnung
          tpopId: $tpopId
          bearbeiter: $bearbeiter
          planVorhanden: $planVorhanden
        }
      }
    ) {
      tpopmassn {
        ...TpopmassnFields
      }
    }
  }
  ${tpopmassn}
`
