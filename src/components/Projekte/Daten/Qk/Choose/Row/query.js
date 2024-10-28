import { gql } from '@apollo/client'

import { apqk } from '../../../../../shared/fragments.js'

export const query = gql`
  query apqkQueryForRow($apId: UUID!, $qkName: String!) {
    apqkByApIdAndQkName(apId: $apId, qkName: $qkName) {
      ...ApqkFields
    }
  }
  ${apqk}
`
