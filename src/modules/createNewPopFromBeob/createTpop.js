import gql from 'graphql-tag'

import { tpop } from '../../components/shared/fragments'

export default gql`
  mutation createTpop(
    $popId: UUID
    $gemeinde: String
    $flurname: String
    $x: Int
    $y: Int
    $bekanntSeit: Int
  ) {
    createTpop(
      input: {
        tpop: {
          popId: $popId
          gemeinde: $gemeinde
          flurname: $flurname
          x: $x
          y: $y
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
