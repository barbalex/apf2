import gql from 'graphql-tag'

import { pop } from '../../components/shared/fragments'

export default gql`
  mutation updatePopById($id: UUID!, $x: Int, $y: Int) {
    updatePopById(input: { id: $id, popPatch: { x: $x, y: $y } }) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
