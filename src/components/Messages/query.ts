import { gql } from '@apollo/client'

export const query = gql`
  query UsermessagesQuery($name: String!, $aYearAgo: Datetime!) {
    allMessages(
      filter: {
        active: { equalTo: true }
        time: { greaterThanOrEqualTo: $aYearAgo }
      }
      orderBy: TIME_ASC
    ) {
      nodes {
        id
        message
        time
        usermessagesByMessageId(filter: { userName: { equalTo: $name } }) {
          totalCount
        }
      }
    }
    allUsers {
      nodes {
        id
        name
      }
    }
  }
`
