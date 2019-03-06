import gql from 'graphql-tag'

import { pop } from '../../../shared/fragments'

export default gql`
  query popByIdQuery($id: UUID!, $showFilter: Boolean!) {
    popById(id: $id) {
      ...PopFields
      apByApId {
        id
        startJahr
      }
    }
    allPops @include(if: $showFilter) {
      totalCount
      nodes {
        ...PopFields
      }
    }
  }
  ${pop}
`
