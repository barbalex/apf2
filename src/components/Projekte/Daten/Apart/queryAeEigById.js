import gql from 'graphql-tag'

export default gql`
  query aeEigByIdQuery($id: UUID!) {
    aeEigenschaftenById(id: $id) {
      id
      artname
    }
  }
`
