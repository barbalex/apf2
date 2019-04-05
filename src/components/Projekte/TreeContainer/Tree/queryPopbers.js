import gql from 'graphql-tag'

import { popber } from '../../../shared/fragments'

export default gql`
  query PopbersQuery($filter: PopberFilter!, $isPop: Boolean!) {
    allPopbers(filter: $filter, orderBy: LABEL_ASC) @include(if: $isPop) {
      nodes {
        ...PopberFields
      }
    }
  }
  ${popber}
`
