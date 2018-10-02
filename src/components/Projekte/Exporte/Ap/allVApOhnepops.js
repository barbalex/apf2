import gql from 'graphql-tag'

export default gql`
  query view {
    allVApOhnepops {
      nodes {
        id
        artname
        bearbeitung
        start_jahr: startJahr
        umsetzung
        bearbeiter
        pop_id: popId
      }
    }
  }
`
