import gql from 'graphql-tag'

import { tpop } from '../../shared/fragments'

export default gql`
  mutation updateTpopById($id: UUID!, $geomPoint: GeometryPoint) {
    updateTpopById(input: { id: $id, tpopPatch: { geomPoint: $geomPoint } }) {
      tpop {
        ...TpopFields
      }
    }
  }
  ${tpop}
`
