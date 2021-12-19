import { gql } from '@apollo/client'

export default gql`
  query allBeobsArtChanged {
    allVBeobArtChangeds {
      nodes {
        id
        quelle
        id_field: idField
        original_id: originalId
        art_id_original: artIdOriginal
        artname_original: artnameOriginal
        taxonomie_id_original: taxonomieIdOriginal
        art_id: artId
        artname
        taxonomie_id: taxonomieId
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
        created_at: createdAt
        updated_at: updatedAt
        changed_by: changedBy
      }
    }
  }
`
