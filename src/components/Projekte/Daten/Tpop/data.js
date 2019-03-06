import gql from 'graphql-tag'

import {
  ap,
  pop,
  popStatusWerte,
  tpop,
  tpopApberrelevantWerte,
} from '../../../shared/fragments'

export default gql`
  query tpopByIdQuery($id: UUID!, $showFilter: Boolean!) {
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
    allTpops @include(if: $showFilter) {
      nodes {
        ...TpopFields
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
    allTpopkontrFrequenzWertes {
      nodes {
        id
        code
        text
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
