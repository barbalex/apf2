import gql from 'graphql-tag'

import { popber } from '../../../shared/fragments'

export default gql`
  query PopbersQuery($pop: [UUID!], $isPop: Boolean!) {
    allPopbers(filter: { popId: { in: $pop } }, orderBy: LABEL_ASC)
      @include(if: $isPop) {
      nodes {
        ...PopberFields
      }
    }
  }
  ${popber}
`
