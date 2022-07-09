import { gql } from '@apollo/client'

export default gql`
  query tpopmassnsFilterQuery(
    $filteredFilter: TpopmassnFilter!
    $allFilter: TpopmassnFilter!
  ) {
    allTpopmassns(filter: $allFilter) {
      totalCount
    }
    tpopmassnsFiltered: allTpopmassns(filter: $filteredFilter) {
      totalCount
    }
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
    allTpopmassnTypWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
        anpflanzung
      }
    }
    allTpopkontrzaehlEinheitWertes(orderBy: SORT_ASC) {
      nodes {
        id
        value: code
        label: text
      }
    }
  }
`
