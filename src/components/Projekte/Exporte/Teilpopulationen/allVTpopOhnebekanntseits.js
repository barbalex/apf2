import gql from 'graphql-tag'

export default gql`
  query view {
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
        x
        y
      }
    }
  }
`
