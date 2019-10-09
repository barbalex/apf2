import gql from 'graphql-tag'

import { message } from '../../../shared/fragments'

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
