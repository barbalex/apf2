import { gql } from '@apollo/client'

import { ap, aeTaxonomies } from '../../../shared/fragments.js'

export const query = gql`
  query apByIdQueryForAp($id: UUID!) {
    apById(id: $id) {
      ...ApFields
      aeTaxonomyByArtId {
        ...AeTaxonomiesFields
      }
    }
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
    allApBearbstandWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allApUmsetzungWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
  ${ap}
  ${aeTaxonomies}
`
