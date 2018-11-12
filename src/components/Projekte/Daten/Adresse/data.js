import gql from 'graphql-tag'

export default gql`
  query adresseById($id: UUID!) {
    adresseById(id: $id) {
      id
      name
      adresse
      telefon
      email
      freiwErfko
      evabVorname
      evabNachname
      evabOrt
    }
  }
`
