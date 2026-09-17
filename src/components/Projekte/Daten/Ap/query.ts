import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { ap, aeTaxonomies } from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
