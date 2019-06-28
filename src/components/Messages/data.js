import gql from 'graphql-tag'

export default gql`
  query UsermessagesQuery($name: String!) {
    allMessages(filter: { active: { equalTo: true } }, orderBy: TIME_ASC) {
      nodes {
        id
        message
        usermessagesByMessageId(filter: { userName: { equalTo: $name } }) {
          nodes {
            id
          }
        }
      }
    }
  }
`
