import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { apqk } from '../../../../../shared/fragments.ts'

export const query = dynamicGql`
  query apqkQueryForRow($apId: UUID!, $qkName: String!) {
    apqkByApIdAndQkName(apId: $apId, qkName: $qkName) {
      ...ApqkFields
    }
  }
  ${apqk}
`
