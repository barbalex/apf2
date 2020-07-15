import { gql } from '@apollo/client'

import { tpop } from '../../components/shared/fragments'

export default gql`
  mutation createTpopForCreateNewPopFromBeob(
    $popId: UUID
    $gemeinde: String
    $flurname: String
    $geomPoint: GeoJSON
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
