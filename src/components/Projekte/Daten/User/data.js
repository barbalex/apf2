import gql from 'graphql-tag'

import { adresse } from '../../../shared/fragments'

export default gql`
  query userById($id: UUID!) {
    userById(id: $id) {
      id
      name
      email
      role
      pass
      adresseId
      adresseByAdresseId {
        ...AdresseFields
      }
    }
  }
  ${adresse}
`
