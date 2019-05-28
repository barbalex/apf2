import gql from 'graphql-tag'

import {
  ap,
  pop,
  popStatusWerte,
  tpop,
  tpopApberrelevantGrundWerte,
} from '../../../shared/fragments'

export default gql`
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
