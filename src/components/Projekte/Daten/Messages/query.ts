import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { message } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query messagesQuery {
    allMessages(orderBy: TIME_DESC) {
      nodes {
        ...MessageFields
      }
    }
  }
  ${message}
`
