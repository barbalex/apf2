import gql from 'graphql-tag'

export default gql`
  query allBeobs {
    allVBeobs(filter: { nichtZuordnen: { equalTo: true } }) {
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
        x
        y
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
