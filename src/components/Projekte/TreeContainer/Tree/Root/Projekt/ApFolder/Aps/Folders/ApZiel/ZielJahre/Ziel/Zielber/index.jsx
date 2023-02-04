import { useContext } from 'react'
import { gql, useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../storeContext'
import Zielber from './Zielber'

const ZielberFolder = ({ projekt, ap, jahr, ziel }) => {
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree
  const client = useApolloClient()

  const zielbersFilter = { zielId: { equalTo: ziel.id } }
  if (nodeLabelFilter.zielber) {
    zielbersFilter.label = {
      includesInsensitive: nodeLabelFilter.zielber,
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['treeZielber', ziel.id, zielbersFilter],
    queryFn: async () => {
      const { data, loading: isLoading } = await client.query({
        query: gql`
          query TreeApzielberFolderQuery(
            $id: UUID!
            $zielbersFilter: ZielberFilter!
          ) {
            zielById(id: $id) {
              id
              zielbersByZielId(filter: $zielbersFilter, orderBy: LABEL_ASC) {
                nodes {
                  id
                  label
                }
              }
            }
          }
        `,
        variables: {
          id: ziel.id,
          zielbersFilter,
        },
        fetchPolicy: 'no-cache',
      })
      return { data, isLoading }
    },
  })

  const nodeLabelFilterString = nodeLabelFilter?.zielber ?? ''
  const zielbers = data?.data?.zielById?.zielbersByZielId?.nodes ?? []
  const zielbersLength = zielbers.length

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${zielbersLength} gefiltert`
    : zielbersLength

  const url = [
    'Projekte',
    projekt.id,
    'Arten',
    ap.id,
    'AP-Ziele',
    jahr,
    ziel.id,
    'Berichte',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 7 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'AP-Ziele' &&
        n[5] === jahr &&
        n[6] === ziel.id,
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'zielberFolder',
    id: `${ziel.id}ZielberFolder`,
    tableId: ziel.id,
    urlLabel: 'Berichte',
    label: `Berichte (${message})`,
    url,
    hasChildren: zielbersLength > 0,
  }

  return (
    <>
      <Row key={node.id} node={node} />
      {isOpen && (
        <Zielber
          zielbers={zielbers}
          projekt={projekt}
          ap={ap}
          jahr={jahr}
          ziel={ziel}
        />
      )}
    </>
  )
}

export default observer(ZielberFolder)
