import gql from 'graphql-tag'

export default gql`
  query ApAeTaxonomiesQuery($id: UUID!, $run: Boolean!) {
    aeTaxonomyById(id: $id) @include(if: $run) {
      id
      artname
    }
  }
`
