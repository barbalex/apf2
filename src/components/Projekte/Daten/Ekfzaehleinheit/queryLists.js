import gql from 'graphql-tag'

export default gql`
  query EkfzaehleinheitDataListQuery(
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
