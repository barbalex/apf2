import gql from 'graphql-tag'

import {
  tpopEntwicklungWerte,
  tpopkontrIdbiotuebereinstWerte,
} from '../../../shared/fragments'

export default gql`
  query listsQuery {
    allTpopkontrIdbiotuebereinstWertes {
      nodes {
        ...TpopkontrIdbiotuebereinstWerteFields
      }
    }
    allTpopEntwicklungWertes {
      nodes {
        ...TpopEntwicklungWerteFields
      }
    }
    allAeLrdelarzes {
      nodes {
        id
        label
        einheit
        sort
      }
    }
  }
  ${tpopEntwicklungWerte}
  ${tpopkontrIdbiotuebereinstWerte}
`
