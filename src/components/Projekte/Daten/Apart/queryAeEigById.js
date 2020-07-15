import { gql } from '@apollo/client'

export default gql`
  query aeEigByIdQuery($id: UUID!) {
    aeTaxonomyById(id: $id) {
      id
      taxArtName
    }
  }
`
