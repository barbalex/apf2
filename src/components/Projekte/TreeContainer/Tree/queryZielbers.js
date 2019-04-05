import gql from 'graphql-tag'

import { zielber } from '../../../shared/fragments'

export default gql`
  query ZielbersQuery($filter: ZielberFilter!, $isZiel: Boolean!) {
    allZielbers(filter: $filter, orderBy: LABEL_ASC) @include(if: $isZiel) {
      nodes {
        ...ZielberFields
      }
    }
  }
  ${zielber}
`
