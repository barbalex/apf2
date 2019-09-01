import gql from 'graphql-tag'

export default gql`
  mutation deleteEkplanByIdSetEkplan($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      ekplan {
        id
      }
    }
  }
`
