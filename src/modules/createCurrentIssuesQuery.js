import { gql } from '@apollo/client'

export const createCurrentissuesQuery = ({ apolloClient }) => ({
  queryKey: ['treeCurrentissues'],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeCurrentissuesQuery {
          allCurrentissues(orderBy: [SORT_ASC, TITLE_ASC]) {
            nodes {
              id
              label
            }
          }
          totalCount: allCurrentissues {
            totalCount
          }
        }
      `,
      fetchPolicy: 'no-cache',
    }),
})
