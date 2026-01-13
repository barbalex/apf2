import { gql } from '@apollo/client'

export const queryAeTaxonomiesById = gql`
  query ApFilterAeTaxonomiesByIdQuery($id: UUID!, $run: Boolean!) {
    aeTaxonomyById(id: $id) @include(if: $run) {
      id
      artname
    }
  }
`
