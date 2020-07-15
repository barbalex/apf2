import { gql } from '@apollo/client'

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
