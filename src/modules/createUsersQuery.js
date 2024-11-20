import { gql } from '@apollo/client'

export const createUsersQuery = ({ userGqlFilterForTree, apolloClient }) => ({
  queryKey: ['treeUser', userGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeUsersQuery($usersFilter: UserFilter!) {
          allUsers(filter: $usersFilter, orderBy: LABEL_ASC) {
            nodes {
              id
              label
            }
          }
          totalCount: allUsers {
            totalCount
          }
        }
      `,
      variables: { usersFilter: userGqlFilterForTree },
      fetchPolicy: 'no-cache',
    }),
})
