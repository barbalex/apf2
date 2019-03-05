import gql from 'graphql-tag'

export const adresse = gql`
  fragment AdresseFields on Adresse {
    id
    name
    adresse
    telefon
    email
    freiwErfko
    evabVorname
    evabNachname
    evabOrt
    changedBy
  }
`

export const ap = gql`
  fragment ApFields on Ap {
    id
    artId
    bearbeitung
    startJahr
    umsetzung
    artId
    bearbeiter
    ekfBeobachtungszeitpunkt
    projId
    changedBy
  }
`

export const tpopber = gql`
  fragment TpopberFields on Tpopber {
    id
    tpopId
    jahr
    entwicklung
    tpopEntwicklungWerteByEntwicklung {
      id
      code
      text
      sort
    }
    bemerkungen
    changedBy
  }
`
