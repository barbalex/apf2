import gql from 'graphql-tag'

export default gql`
  query MessagesDataQuery {
    allMessages {
      totalCount
    }
  }
`
