import gql from 'graphql-tag'

import { tpop } from '../../shared/fragments'

export default gql`
  mutation updateTpopById($id: UUID!, $x: Int, $y: Int) {
    updateTpopById(input: { id: $id, tpopPatch: { x: $x, y: $y } }) {
      tpop {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
