import { gql } from '@apollo/client'

import { adresse } from '../../../shared/fragments'

export default gql`
  mutation createAdresseForUndelete(
    $id: UUID
    $name: String
    $adresse: String
    $telefon: String
    $email: String
    $freiwErfko: Boolean
  ) {
    createAdresse(
      input: {
        adresse: {
          id: $id
          name: $name
          adresse: $adresse
          telefon: $telefon
          email: $email
          freiwErfko: $freiwErfko
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
