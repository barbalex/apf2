import gql from 'graphql-tag'

export default gql`
  query ApAeEigenschaftenQuery($id: UUID!) {
    aeEigenschaftenById(id: $id) {
      id
      artname
    }
  }
`
