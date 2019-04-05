import gql from 'graphql-tag'

import { popmassnber } from '../../../shared/fragments'

export default gql`
  query PopmassnbersQuery($filter: PopmassnberFilter!, $isPop: Boolean!) {
    allPopmassnbers(filter: $filter, orderBy: LABEL_ASC) @include(if: $isPop) {
      nodes {
        ...PopmassnberFields
      }
    }
  }
  ${popmassnber}
`
