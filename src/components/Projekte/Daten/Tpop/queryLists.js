import gql from 'graphql-tag'

import { tpopApberrelevantWerte } from '../../../shared/fragments'

export default gql`
  query tpopByIdQuery {
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
  ${tpopApberrelevantWerte}
`
