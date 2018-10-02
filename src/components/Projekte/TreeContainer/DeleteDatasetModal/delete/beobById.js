import gql from 'graphql-tag'

export default gql`
  query beobById($id: UUID!) {
    beobById(id: $id) {
      id
      idField
      datum
      autor
      x
      y
      data
      artId
      tpopId
      nichtZuordnen
      bemerkungen
      quelleId
    }
  }
`
