import { graphql } from '../../../../gql'

export const queryAeTaxonomiesById = graphql(`
  query ApFilterAeTaxonomiesByIdQuery($id: UUID!, $run: Boolean!) {
    aeTaxonomyById(id: $id) @include(if: $run) {
      id
      artname
    }
  }
`)
