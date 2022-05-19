import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../shared/fragments'

export default gql`
  query TpopkontrzaehlQueryForEkZaehl($id: UUID!, $codes: [Int!]) { 
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
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
  ${tpopkontrzaehl}
`
