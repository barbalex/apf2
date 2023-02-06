import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'

import Row from '../../../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../../../storeContext'
import Zaehl from './Zaehl'

const TpopFeldkontrZaehlFolder = ({ projekt, ap, pop, tpop, tpopkontr }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const tpopkontrzaehlsFilter = {
    tpopkontrId: { equalTo: tpopkontr.id },
  }
  if (nodeLabelFilter.tpopkontrzaehl) {
    tpopkontrzaehlsFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopkontrzaehl,
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: [
      'treeTpopfeldkontrzaehlFolders',
      tpopkontr.id,
      tpopkontrzaehlsFilter,
    ],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeTpopfeldkontrzaehlsQuery(
            $id: UUID!
            $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
          ) {
            tpopkontrById(id: $id) {
              id
              tpopkontrzaehlsByTpopkontrId(filter: $tpopkontrzaehlsFilter) {
                totalCount
              }
            }
          }
        `,
        variables: {
          id: tpopkontr.id,
          tpopkontrzaehlsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const count =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.totalCount ?? 0

  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.tpopkontrzaehl ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = [
    'Projekte',
    projekt.id,
    'Arten',
    ap.id,
    'Populationen',
    pop.id,
    'Teil-Populationen',
    tpop.id,
    'Feld-Kontrollen',
    tpopkontr.id,
    'Zaehlungen',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'Populationen' &&
        n[5] === pop.id &&
        n[6] === 'Teil-Populationen' &&
        n[7] === tpop.id &&
        n[8] === 'Feld-Kontrollen' &&
        n[9] === tpopkontr.id &&
        n[10] === 'Zaehlungen',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'tpopfeldkontrzaehlFolder',
    id: `${tpopkontr.id}TpopfeldkontrzaehlFolder`,
    tableId: tpopkontr.id,
    urlLabel: 'Zaehlungen',
    label: `Zählungen (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && (
        <Zaehl
          projekt={projekt}
          ap={ap}
          pop={pop}
          tpop={tpop}
          tpopkontr={tpopkontr}
        />
      )}
    </>
  )
}

export default observer(TpopFeldkontrZaehlFolder)
