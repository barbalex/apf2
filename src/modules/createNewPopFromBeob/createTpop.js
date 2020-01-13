import gql from 'graphql-tag'

import { tpop } from '../../components/shared/fragments'

export default gql`
  mutation createTpop(
    $popId: UUID
    $gemeinde: String
    $flurname: String
    $geomPoint: GeometryPoint
    $bekanntSeit: Int
  ) {
    createTpop(
      input: {
        tpop: {
          popId: $popId
          gemeinde: $gemeinde
          flurname: $flurname
          geomPoint: $geomPoint
          bekanntSeit: $bekanntSeit
        }
      }
    ) {
      tpop {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
