import { useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQueryClient, useQuery } from '@tanstack/react-query'

import { Row } from '../../../Row.jsx'
import { StoreContext } from '../../../../../../../storeContext.js'

export const Adresse = () => {
  const client = useApolloClient()
  const tanstackClient = useQueryClient()
  const store = useContext(StoreContext)
  const { nodeLabelFilter } = store.tree

  const adressesFilter =
    nodeLabelFilter.adresse ?
      { label: { includesInsensitive: nodeLabelFilter.adresse } }
    : { id: { isNull: false } }

  const { data } = useQuery({
    queryKey: ['treeAdresse', adressesFilter],
    queryFn: async () =>
      client.query({
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
          adressesFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  return (data?.data?.allAdresses?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'adresse',
      id: el.id,
      parentId: 'adresseFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'Adressen', el.id],
      hasChildren: false,
    }

    return (
      <Row
        key={el.id}
        node={node}
      />
    )
  })
}
