import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpopfeldkontr } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query tpopkontrByIdQueryForEk($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopfeldkontrFields
    }
    allTpopkontrIdbiotuebereinstWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allTpopEntwicklungWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allAeLrDelarzes(orderBy: LABEL_ASC) {
      nodes {
        id
        label
        einheit
      }
    }
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
  ${tpopfeldkontr}
`
