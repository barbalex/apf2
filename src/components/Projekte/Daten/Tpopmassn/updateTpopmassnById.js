import { gql } from '@apollo/client'

import { tpopmassn } from '../../../shared/fragments'

export default gql`
  mutation updateTpopmassn(
    $id: UUID!
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
    $zieleinheitEinheit: Int
    $zieleinheitAnzahl: Int
    $wirtspflanze: String
    $herkunftPop: String
    $sammeldatum: String
    $form: String
    $pflanzanordnung: String
    $tpopId: UUID
    $bearbeiter: UUID
    $planVorhanden: Boolean
    $changedBy: String
  ) {
    updateTpopmassnById(
      input: {
        id: $id
        tpopmassnPatch: {
          id: $id
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
          form: $form
          pflanzanordnung: $pflanzanordnung
          tpopId: $tpopId
          bearbeiter: $bearbeiter
          planVorhanden: $planVorhanden
          changedBy: $changedBy
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
