import { gql } from '@apollo/client'

import { ekfrequenz } from '../../../../shared/fragments'

export default gql`
  query TpopEkQuery($apId: UUID!) {
    allEkfrequenzs(filter: { apId: { equalTo: $apId } }, orderBy: SORT_ASC) {
      nodes {
        ...EkfrequenzFields
      }
    }
    allAdresses(orderBy: NAME_ASC, filter: { usersByAdresseIdExist: true }) {
      nodes {
        value: id
        label: name
      }
    }
  }
  ${ekfrequenz}
`
