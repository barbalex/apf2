import gql from 'graphql-tag'

export default gql`
  query ApAeEigenschaftenQuery($id: UUID!, $run: Boolean!) {
    aeEigenschaftenById(id: $id) @include(if: $run) {
      id
      artname
    }
  }
`
