import gql from 'graphql-tag'

export default gql`
  query viewApApberundmassns {
    allVApApberundmassns {
      nodes {
        id
        artname
        bearbeitung
        start_jahr: startJahr
        umsetzung
        bearbeiter
        artwert
        massn_jahr: massnJahr
        massn_anzahl: massnAnzahl
        massn_anzahl_bisher: massnAnzahlBisher
        bericht_erstellt: berichtErstellt
      }
    }
  }
`
