import { gql } from '@apollo/client'

export default gql`
  query ApFilterAeTaxonomiesByIdQuery($id: UUID!, $run: Boolean!) {
    aeTaxonomyById(id: $id) @include(if: $run) {
      id
      artname
    }
  }
`
