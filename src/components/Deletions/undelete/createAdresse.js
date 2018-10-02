import gql from 'graphql-tag'

export default gql`
  mutation createUser(
    $id: UUID
    $name: String
    $adresse: String
    $telefon: String
    $email: String
    $freiwErfko: Boolean
    $evabVorname: String
    $evabNachname: String
    $evabOrt: String
  ) {
    createUser(
      input: {
        user: {
          id: $id
          name: $name
          adresse: $adresse
          telefon: $telefon
          email: $email
          freiwErfko: $freiwErfko
          evabVorname: $evabVorname
          evabNachname: $evabNachname
          evabOrt: $evabOrt
        }
      }
    ) {
      user {
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
  }
`
