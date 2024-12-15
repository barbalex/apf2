import { gql } from '@apollo/client'

import { ekfrequenz } from '../../../shared/fragments.js'

export const query = gql`
  query TpopEkQuery($id: UUID!, $apId: UUID!) {
    allEkplans(filter: { tpopId: { equalTo: $id } }) {
      nodes {
        id
        jahr
        typ
      }
    }
    allTpopkontrs(filter: { tpopId: { equalTo: $id } }) {
      nodes {
        id
        jahr
        typ
      }
    }
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
