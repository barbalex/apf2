import gql from 'graphql-tag'

import { zielber } from '../../../shared/fragments'

export default gql`
  query ZielbersQuery($ziel: [UUID!], $isZiel: Boolean!) {
    allZielbers(filter: { zielId: { in: $ziel } }, orderBy: JAHR_ASC)
      @include(if: $isZiel) {
      nodes {
        ...ZielberFields
      }
    }
  }
  ${zielber}
`
