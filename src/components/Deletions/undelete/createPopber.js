import gql from 'graphql-tag'

export default gql`
  mutation createPopber(
    $id: UUID
    $popId: UUID
    $jahr: Int
    $entwicklung: Int
    $bemerkungen: String
  ) {
    createPopber(
      input: {
        popber: {
          id: $id
          popId: $popId
          jahr: $jahr
          entwicklung: $entwicklung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      popber {
        id
        popId
        jahr
        entwicklung
        bemerkungen
      }
    }
  }
`
