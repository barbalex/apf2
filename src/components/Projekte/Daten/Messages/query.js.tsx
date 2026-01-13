import { gql } from '@apollo/client'

import { message } from '../../../shared/fragments.js'

export const query = gql`
  query messagesQuery {
    allMessages(orderBy: TIME_DESC) {
      nodes {
        ...MessageFields
      }
    }
  }
  ${message}
`
