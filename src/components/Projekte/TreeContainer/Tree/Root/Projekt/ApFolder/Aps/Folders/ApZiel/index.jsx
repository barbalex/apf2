import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import union from 'lodash/union'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'
import ZielJahre from './ZielJahre'

const ApZielFolder = ({ projekt, ap }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter, openNodes } = store.tree

  const zielsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.ziel) {
    zielsFilter.label = {
      includesInsensitive: nodeLabelFilter.ziel,
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['treeZieljahrFolders', ap.id, zielsFilter],
    queryFn: async () => {
      const { data, loading: isLoading } = await client.query({
        query: gql`
          query TreeApZieljahrFolderQuery(
            $apId: UUID!
            $zielsFilter: ZielFilter!
          ) {
            apById(id: $apId) {
              id
              zielsByApId(filter: $zielsFilter, orderBy: LABEL_ASC) {
                nodes {
                  id
                  label
                  jahr
                }
              }
            }
          }
        `,
        variables: {
          apId: ap.id,
          zielsFilter,
        },
        fetchPolicy: 'no-cache',
      })
      return { data, isLoading }
    },
  })

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ziel ?? ''

  const ziels = data?.data?.apById?.zielsByApId?.nodes ?? []
  const zieljahre = ziels
    // reduce to distinct years
    .reduce((a, el) => union(a, [el.jahr]), [])
    .sort((a, b) => a - b)
  const zieljahreLength = zieljahre.length
  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'} gefiltert`
    : `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'}`

  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Ziele']

  const isOpen =
    openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'AP-Ziele',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'zielFolder',
    id: `${ap.id}ApzielFolder`,
    tableId: ap.id,
    urlLabel: 'AP-Ziele',
    label: `AP-Ziele (${message})`,
    url,
    hasChildren: zieljahreLength > 0,
  }

  return (
    <>
      <Row key={node.id} node={node} />
      {isOpen && (
        <ZielJahre
          projekt={projekt}
          ap={ap}
          ziels={ziels}
          zieljahre={zieljahre}
        />
      )}
    </>
  )
}

export default observer(ApZielFolder)
