import { gql } from '@apollo/client'

export default gql`
  query EkplanApQuery($ids: [UUID!]) {
    allAps(filter: { id: { in: $ids } }) {
      nodes {
        id
        ekzaehleinheitsByApId(
          filter: { zielrelevant: { equalTo: true } }
          orderBy: TPOPKONTRZAEHL_EINHEIT_WERTE_BY_ZAEHLEINHEIT_ID__SORT_ASC
        ) {
          nodes {
            id
            tpopkontrzaehlEinheitWerteByZaehleinheitId {
              id
              code
              text
            }
          }
        }
      }
    }
  }
`
