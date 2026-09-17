import { gql as dynamicGql } from '../../../../apolloGql.ts'

import {
  ap,
  pop,
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
