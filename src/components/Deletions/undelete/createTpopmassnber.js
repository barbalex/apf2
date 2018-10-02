import gql from 'graphql-tag'

export default gql`
  mutation createTpopmassnber(
    $id: UUID
    $tpopId: UUID
    $jahr: Int
    $beurteilung: Int
    $bemerkungen: String
  ) {
    createTpopmassnber(
      input: {
        tpopmassnber: {
          id: $id
          tpopId: $tpopId
          jahr: $jahr
          beurteilung: $beurteilung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      tpopmassnber {
        id
        tpopId
        jahr
        beurteilung
        bemerkungen
      }
    }
  }
`
