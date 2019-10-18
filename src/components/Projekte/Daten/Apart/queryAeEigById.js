import gql from 'graphql-tag'

export default gql`
  query aeEigByIdQuery($id: UUID!) {
    aeTaxonomyById(id: $id) {
      id
      artname
    }
  }
`
