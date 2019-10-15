import gql from 'graphql-tag'

import { qk } from '../../../shared/fragments'

export default gql`
  query QkQuery {
    allQks {
      nodes {
        ...QkFields
      }
    }
  }
  ${qk}
`
