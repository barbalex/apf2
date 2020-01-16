import gql from 'graphql-tag'

import { pop } from '../../shared/fragments'

/**
 * add geomPoint: "SRID=4326;POINT(47.3021 8.5530)"
 */

export default gql`
  mutation createPopForUndelete(
    $id: UUID
    $apId: UUID
    $nr: Int
    $name: String
    $status: Int
    $statusUnklar: Boolean
    $statusUnklarBegruendung: String
    $bekanntSeit: Int
    $geomPoint: GeoJSON
  ) {
    createPop(
      input: {
        pop: {
          id: $id
          apId: $apId
          nr: $nr
          name: $name
          status: $status
          statusUnklar: $statusUnklar
          statusUnklarBegruendung: $statusUnklarBegruendung
          bekanntSeit: $bekanntSeit
          geomPoint: $geomPoint
        }
      }
    ) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
