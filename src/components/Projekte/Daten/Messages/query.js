import { gql } from '@apollo/client'

import { message } from '../../../shared/fragments.js'

export default gql`
  query messagesQuery {
    allMessages(orderBy: TIME_DESC) {
      nodes {
        ...MessageFields
      }
    }
  }
  ${message}
`
