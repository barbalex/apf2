import gql from 'graphql-tag'

export default gql`
  mutation createTpopber(
    $id: UUID
    $tpopId: UUID
    $jahr: Int
    $entwicklung: Int
    $bemerkungen: String
  ) {
    createTpopber(
      input: {
        tpopber: {
          id: $id
          tpopId: $tpopId
          jahr: $jahr
          entwicklung: $entwicklung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      tpopber {
        id
        tpopId
        jahr
        entwicklung
        bemerkungen
      }
    }
  }
`
