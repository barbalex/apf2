import gql from 'graphql-tag'

import {
  apBearbstandWerte,
  apUmsetzungWerte,
} from '../../../shared/fragments'

export default gql`
  query apListsQuery {
    allApBearbstandWertes {
      nodes {
        ...ApBearbstandWerteFields
      }
    }
    allApUmsetzungWertes {
      nodes {
        ...ApUmsetzungWerteFields
      }
    }
  }
  ${apBearbstandWerte}
  ${apUmsetzungWerte}
`
