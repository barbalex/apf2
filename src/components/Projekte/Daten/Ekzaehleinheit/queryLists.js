import { gql } from '@apollo/client'

export default gql`
  query EkzaehleinheitDataListQuery(
    $filter: TpopkontrzaehlEinheitWerteFilter!
  ) {
    allTpopkontrzaehlEinheitWertes(filter: $filter, orderBy: TEXT_ASC) {
      nodes {
        value: id
        label: text
      }
    }
  }
`
