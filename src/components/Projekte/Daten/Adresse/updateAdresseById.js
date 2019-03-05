import gql from 'graphql-tag'

import { adresse } from '../../../shared/fragments'

export default gql`
  mutation updateAdresse(
    $id: UUID!
    $name: String
    $adresse: String
    $telefon: String
    $email: String
    $freiwErfko: Boolean
    $evabVorname: String
    $evabNachname: String
    $evabOrt: String
    $changedBy: String
  ) {
    updateAdresseById(
      input: {
        id: $id
        adressePatch: {
          id: $id
          name: $name
          adresse: $adresse
          telefon: $telefon
          email: $email
          freiwErfko: $freiwErfko
          evabVorname: $evabVorname
          evabNachname: $evabNachname
          evabOrt: $evabOrt
          changedBy: $changedBy
        }
      }
    ) {
      adresse {
        ...AdresseFields
      }
    }
  }
  ${adresse}
`
