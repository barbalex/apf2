import gql from 'graphql-tag'

export default gql`
  query projektByIdQuery($id: UUID!) {
    projektById(id: $id) {
      id
      name
    }
  }
`
