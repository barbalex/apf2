import { gql } from '@apollo/client'

export const createAdressesQuery = ({ adresseGqlFilterForTree, apolloClient }) => ({
  queryKey: ['treeAdresses', adresseGqlFilterForTree],
  queryFn: () =>
    apolloClient.query({
      query: gql`
        query TreeAdressesQuery($adressesFilter: AdresseFilter!) {
          allAdresses(filter: $adressesFilter, orderBy: LABEL_ASC) {
            nodes {
              id
              label
            }
          }
          totalCount: allAdresses {
            totalCount
          }
        }
      `,
      variables: { adressesFilter: adresseGqlFilterForTree },
      fetchPolicy: 'no-cache',
    }),
})
