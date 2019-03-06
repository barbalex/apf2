import gql from 'graphql-tag'

import { adresse } from '../../../shared/fragments'

export default gql`
  query AllAdressesQuery {
    allAdresses {
      nodes {
        ...AdresseFields
      }
    }
  }
  ${adresse}
`
