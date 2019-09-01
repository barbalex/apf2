import gql from 'graphql-tag'

export default gql`
  mutation deleteEkplanByIdCellForYearMenu($id: UUID!) {
    deleteEkplanById(input: { id: $id }) {
      deletedEkplanId
    }
  }
`
