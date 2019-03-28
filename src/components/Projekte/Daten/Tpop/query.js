import gql from 'graphql-tag'

import {
  ap,
  pop,
  popStatusWerte,
  tpop,
  tpopApberrelevantWerte,
} from '../../../shared/fragments'

export default gql`
  query tpopByIdQuery($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
      popStatusWerteByStatus {
        ...PopStatusWerteFields
      }
      tpopApberrelevantWerteByApberRelevant {
        ...TpopApberrelevantWerteFields
      }
      popByPopId {
        ...PopFields
        apByApId {
          ...ApFields
        }
      }
    }
    allPopStatusWertes {
      nodes {
        ...PopStatusWerteFields
      }
    }
    allTpopApberrelevantWertes {
      nodes {
        ...TpopApberrelevantWerteFields
      }
    }
    allGemeindes {
      nodes {
        id
        name
      }
    }
  }
  ${ap}
  ${pop}
  ${popStatusWerte}
  ${tpop}
  ${tpopApberrelevantWerte}
`
