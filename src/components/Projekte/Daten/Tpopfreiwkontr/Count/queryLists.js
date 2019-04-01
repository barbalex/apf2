import gql from 'graphql-tag'

import { tpopkontrzaehlEinheitWerte } from '../../../../shared/fragments'

export default gql`
  query AllTpopkontrzaehlEinheitWertesQuery {
    allTpopkontrzaehlEinheitWertes {
      nodes {
        ...TpopkontrzaehlEinheitWerteFields
      }
    }
  }
  ${tpopkontrzaehlEinheitWerte}
`
