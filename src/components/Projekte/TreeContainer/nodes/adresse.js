import { gql } from '@apollo/client'

const adresse = async ({ store, treeQueryVariables }) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treeAdresses', treeQueryVariables.adressesFilter],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeAdressesQuery($adressesFilter: AdresseFilter!) {
            allAdresses(filter: $adressesFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          adressesFilter: treeQueryVariables.adressesFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const adresses = data?.allAdresses?.nodes ?? []

  const nodes = adresses.map((el) => ({
    nodeType: 'table',
    menuType: 'adresse',
    filterTable: 'adresse',
    id: el.id,
    parentId: 'adresseFolder',
    urlLabel: el.id,
    label: el.label,
    url: ['Werte-Listen', 'Adressen', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default adresse
