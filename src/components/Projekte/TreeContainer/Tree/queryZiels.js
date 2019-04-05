import gql from 'graphql-tag'

import { ziel } from '../../../shared/fragments'

export default gql`
  query ZielsQuery($filter: ZielFilter!, $isAp: Boolean!) {
    allZiels(filter: $filter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        ...ZielFields
      }
    }
  }
  ${ziel}
`
