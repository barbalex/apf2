import { gql } from '@apollo/client'

export default gql`
  query viewTpopOhneapberichtrelevants {
    allVTpopOhneapberichtrelevants {
      nodes {
        artname
        pop_nr: popNr
        pop_name: popName
        id
        nr
        gemeinde
        flurname
        apber_relevant: apberRelevant
        apber_relevant_grund: apberRelevantGrund
        lv95X: x
        lv95Y: y
      }
    }
  }
`
