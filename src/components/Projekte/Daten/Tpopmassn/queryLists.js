import gql from 'graphql-tag'

import { tpopmassnTypWerte } from '../../../shared/fragments'

export default gql`
  query listsQuery {
    allTpopmassnTypWertes {
      nodes {
        ...TpopmassnTypWerteFields
      }
    }
  }
  ${tpopmassnTypWerte}
`
