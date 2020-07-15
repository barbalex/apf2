import { gql } from '@apollo/client'

export default gql`
  query viewTpopOhnebekanntseits {
    allVTpopOhnebekanntseits {
      nodes {
        artname
        ap_bearbeitung: apBearbeitung
        pop_nr: popNr
        pop_name: popName
        id
        nr
        gemeinde
        flurname
        bekannt_seit: bekanntSeit
        lv95X: x
        lv95Y: y
      }
    }
  }
`
