import gql from 'graphql-tag'

import { pop } from '../../components/shared/fragments'

export default gql`
  mutation updatePopById($id: UUID!, $geomPoint: GeoJSON) {
    updatePopById(input: { id: $id, popPatch: { geomPoint: $geomPoint } }) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
