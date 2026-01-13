import { gql } from '@apollo/client'

export const queryLists = gql`
  query EkzaehleinheitDataListQuery(
    $filter: TpopkontrzaehlEinheitWerteFilter!
  ) {
    allTpopkontrzaehlEinheitWertes(filter: $filter, orderBy: TEXT_ASC) {
      nodes {
        id
        value: id
        label: text
      }
    }
  }
`
