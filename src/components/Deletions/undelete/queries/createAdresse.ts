import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { adresse } from '../../../shared/fragments.ts'

export default dynamicGql`
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
