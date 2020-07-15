import { gql } from '@apollo/client'

export default gql`
  query TpopkontrzaehlListsQuery($codes: [Int!]) {
    allTpopkontrzaehlEinheitWertes(
      orderBy: SORT_ASC
      filter: { code: { notIn: $codes } }
    ) {
      nodes {
        value: code
        label: text
      }
    }
    allTpopkontrzaehlMethodeWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
