import gql from 'graphql-tag'

import { ap, aeTaxonomies } from '../../../shared/fragments'

export default gql`
  query apByIdQuery($id: UUID!) {
    apById(id: $id) {
      ...ApFields
      aeTaxonomyByArtId {
        ...AeTaxonomiesFields
      }
    }
  }
  ${ap}
  ${aeTaxonomies}
`
