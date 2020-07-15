import { gql } from '@apollo/client'

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
            # accept empty year - in case ekf was manually created
            or: [{ jahr: { equalTo: $jahr } }, { jahr: { isNull: true } }]
          }
        ) {
          totalCount
        }
      }
    }
  }
`
