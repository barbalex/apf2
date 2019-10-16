import gql from 'graphql-tag'

import { apqk } from '../../../../../shared/fragments'

export default gql`
  query apqkQueryForRow($apId: UUID!, $qkName: String!) {
    apqkByApIdAndQkName(apId: $apId, qkName: $qkName) {
      ...ApqkFields
    }
  }
  ${apqk}
`
