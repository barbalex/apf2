import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@tanstack/react-query'
import { gql } from '@apollo/client'

import Row from '../../Row'
import storeContext from '../../../../../../storeContext'

const WlFolderNode = ({ treeQueryVariables }) => {
  const store = useContext(storeContext)
  const isOpen = store.tree.openNodes.some(
    (nodeArray) => nodeArray[0] === 'Werte-Listen',
  )

  const { data, isLoading } = useQuery({
    queryKey: [],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeWlFolderQuery(
            $adressesFilter: AdresseFilter!
            $apberrelevantGrundWertesFilter: TpopApberrelevantGrundWerteFilter!
            $ekAbrechnungstypWertesFilter: EkAbrechnungstypWerteFilter!
            $tpopkontrzaehlEinheitWertesFilter: TpopkontrzaehlEinheitWerteFilter!
            $isOpen: Boolean!
          ) {
            allAdresses(filter: $adressesFilter) @include(if: $isOpen) {
              totalCount
            }
            allTpopApberrelevantGrundWertes(
              filter: $apberrelevantGrundWertesFilter
            ) @include(if: $isOpen) {
              totalCount
            }
            allEkAbrechnungstypWertes(filter: $ekAbrechnungstypWertesFilter)
              @include(if: $isOpen) {
              totalCount
            }
            allTpopkontrzaehlEinheitWertes(
              filter: $tpopkontrzaehlEinheitWertesFilter
            ) @include(if: $isOpen) {
              totalCount
            }
          }
        `,
        variables: {
          adressesFilter: treeQueryVariables.adressesFilter,
          apberrelevantGrundWertesFilter:
            treeQueryVariables.apberrelevantGrundWertesFilter,
          ekAbrechnungstypWertesFilter:
            treeQueryVariables.ekAbrechnungstypWertesFilter,
          tpopkontrzaehlEinheitWertesFilter:
            treeQueryVariables.tpopkontrzaehlEinheitWertesFilter,
          isOpen,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const adressenCount = data?.data?.allAdresses?.totalCount ?? 0
  const apberrelevantGrundWertesCount =
    data?.data?.allTpopApberrelevantGrundWertes?.totalCount ?? 0
  const ekAbrechnungstypWertesCount =
    data?.data?.allEkAbrechnungstypWertes?.totalCount ?? 0
  const tpopkontrzaehlEinheitWertesCount =
    data?.data?.allTpopkontrzaehlEinheitWertes?.totalCount ?? 0

  console.log('WlFolderNode', {
    isOpen,
    adressenCount,
    apberrelevantGrundWertesCount,
    ekAbrechnungstypWertesCount,
    tpopkontrzaehlEinheitWertesCount,
  })

  // TODO:
  // children = [
  //   adressenFolderNode,
  //   apberrelevantGrundWerteFolderNode,
  //   ekAbrechnungstypWerteFolderNode,
  //   tpopkontrzaehlEinheitWerteFolderNode,
  // ]

  const node = {
    nodeType: 'folder',
    menuType: 'wlFolder',
    id: 'wlFolder',
    urlLabel: 'Werte-Listen',
    label: `Werte-Listen`,
    url: ['Werte-Listen'],
    hasChildren: true,
  }

  return <Row node={node} />
}

export default observer(WlFolderNode)
