import gql from 'graphql-tag'

import { ap, pop, tpop } from '../../../shared/fragments'

export default gql`
  query tpopByIdQuery($id: UUID!, $showFilter: Boolean!) {
    tpopById(id: $id) {
      ...TpopFields
      popStatusWerteByStatus {
        id
        text
      }
      tpopApberrelevantWerteByApberRelevant {
        id
        text
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
        id
        code
        text
        sort
      }
    }
    allTpopApberrelevantWertes {
      nodes {
        id
        code
        text
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
  ${tpop}
`
