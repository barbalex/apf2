import gql from 'graphql-tag'

export default gql`
  query apByIdQuery($id: UUID!) {
    apById(id: $id) {
      id
      bearbeitung
    }
  }
`
