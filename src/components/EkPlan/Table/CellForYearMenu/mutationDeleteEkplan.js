import gql from 'graphql-tag'

export default gql`
  mutation deleteEkplanById($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      deletedEkplanId
    }
  }
`
