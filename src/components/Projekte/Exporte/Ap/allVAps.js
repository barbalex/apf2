import gql from 'graphql-tag'

export default gql`
  query viewAps {
    allVAps {
      nodes {
        id
        artname
        bearbeitung
        start_jahr: startJahr
        umsetzung
        bearbeiter
        changed
        changed_by: changedBy
      }
    }
  }
`
