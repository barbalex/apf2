import gql from 'graphql-tag'

import { popmassnber } from '../../../shared/fragments'

export default gql`
  query PopmassnbersQuery($pop: [UUID!], $isPop: Boolean!) {
    allPopmassnbers(filter: { popId: { in: $pop } }, orderBy: LABEL_ASC)
      @include(if: $isPop) {
      nodes {
        ...PopmassnberFields
      }
    }
  }
  ${popmassnber}
`
