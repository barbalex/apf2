import gql from 'graphql-tag'

import { tpopmassn } from '../../shared/fragments'

export default gql`
  mutation createTpopmassn(
    $id: UUID
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
        ...TpopmassnFields
      }
    }
  }
  ${tpopmassn}
`
