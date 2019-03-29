import gql from 'graphql-tag'

import { adresse, user } from '../../../shared/fragments'

export default gql`
  query userById($id: UUID!) {
    userById(id: $id) {
      ...UserFields
      adresseByAdresseId {
        ...AdresseFields
      }
    }
  }
  ${adresse}
  ${user}
`
