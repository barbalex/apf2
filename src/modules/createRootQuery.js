import { gql } from '@apollo/client'

export const createRootQuery = ({ userGqlFilterForTree, apolloClient }) => ({
  queryKey: ['treeRoot', userGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeRootQuery($usersFilter: UserFilter!) {
          allUsers {
            totalCount
          }
          filteredUsers: allUsers(filter: $usersFilter) {
            totalCount
          }
          allMessages {
            totalCount
          }
          allCurrentissues {
            totalCount
          }
        }
      `,
      variables: {
        usersFilter: userGqlFilterForTree,
      },
      fetchPolicy: 'no-cache',
    }),
})
