import gql from 'graphql-tag'

import {
  aeLrDelarze,
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
        ...AeLrDelarzeFields
      }
    }
  }
  ${aeLrDelarze}
  ${tpopEntwicklungWerte}
  ${tpopkontrIdbiotuebereinstWerte}
`
