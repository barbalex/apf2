import gql from 'graphql-tag'

import { apart } from '../../../shared/fragments'

export default gql`
  query ApartsQuery($filter: ApartFilter!, $isAp: Boolean!) {
    allAparts(filter: $filter, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        ...ApartFields
      }
    }
  }
  ${apart}
`
