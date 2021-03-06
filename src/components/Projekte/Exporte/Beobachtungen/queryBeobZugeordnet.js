import { gql } from '@apollo/client'

export default gql`
  query ZugeordnetForExport {
    allVBeobs(filter: { tpopId: { isNull: false } }) {
      nodes {
        id
        quelle
        id_field: idField
        original_id: originalId
        art_id: artId
        art_id_original: artIdOriginal
        artname
        pop_id: popId
        pop_nr: popNr
        tpop_id: tpopId
        tpop_nr: tpopNr
        tpop_status: tpopStatus
        tpop_gemeinde: tpopGemeinde
        tpop_flurname: tpopFlurname
        lv95X: x
        lv95Y: y
        distanz_zur_teilpopulation: distanzZurTeilpopulation
        datum
        autor
        nicht_zuordnen: nichtZuordnen
        bemerkungen
        changed
        changed_by: changedBy
      }
    }
  }
`
