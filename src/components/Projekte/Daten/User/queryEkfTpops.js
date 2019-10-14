import gql from 'graphql-tag'

export default gql`
  query ekfTpopsForUserQuery($id: UUID!, $jahr: Int!, $include: Boolean!) {
    ekfTpops: allTpops(filter: { ekfKontrolleur: { equalTo: $id } })
      @include(if: $include) {
      totalCount
      nodes {
        id
        ekfInJahr: tpopkontrsByTpopId(
          filter: {
            typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
            jahr: { equalTo: $jahr }
          }
        ) {
          totalCount
        }
      }
    }
  }
`
