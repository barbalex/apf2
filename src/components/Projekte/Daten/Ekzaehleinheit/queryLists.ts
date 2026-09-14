import { graphql } from '../../../../gql'

export const queryLists = graphql(`
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
`)
