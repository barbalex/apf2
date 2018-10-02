import gql from 'graphql-tag'

export default gql`
  query apartByIdQuery($id: UUID!) {
    apartById(id: $id) {
      id
      apId
      artId
      aeEigenschaftenByArtId {
        id
        artname
      }
    }
  }
`
