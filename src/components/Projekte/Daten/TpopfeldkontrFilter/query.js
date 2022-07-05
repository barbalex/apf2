import { gql } from '@apollo/client'

import { tpopfeldkontr } from '../../../shared/fragments'

export default gql`
  query tpopkontrByIdQueryForEkFilter {
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
