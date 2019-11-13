import gql from 'graphql-tag'

export default gql`
  query EkfrequenzQueryForSetStartjahr($id: UUID!) {
    ekfrequenzById(id: $id) {
      id
      kontrolljahreAb
    }
  }
`
