import { gql } from '@apollo/client'

import {
  ap,
  pop,
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments.js'

export const query = gql`
  query tpopByIdQuery($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
      popStatusWerteByStatus {
        ...PopStatusWerteFields
      }
      tpopApberrelevantGrundWerteByApberRelevantGrund {
        ...TpopApberrelevantGrundWerteFields
      }
      popByPopId {
        ...PopFields
        apByApId {
          ...ApFields
        }
      }
    }
  }
  ${ap}
  ${pop}
  ${popStatusWerte}
  ${tpop}
  ${tpopApberrelevantGrundWerte}
`
