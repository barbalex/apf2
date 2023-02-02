import { gql } from '@apollo/client'

import adresseFolder from './adresseFolder'
import apberrelevantGrundWerteFolder from './apberrelevantGrundWerteFolder'
import ekAbrechnungstypWerteFolder from './ekAbrechnungstypWerteFolder'
import tpopkontrzaehlEinheitWerteFolder from './tpopkontrzaehlEinheitWerteFolder'

const wlFolderNodes = async ({ treeQueryVariables, store }) => {
  const isOpen = store.tree.openNodes.some(
    (nodeArray) => nodeArray[0] === 'Werte-Listen',
  )

  let children = []

  if (isOpen) {
    const { data, isLoading } = await store.queryClient.fetchQuery({
      queryKey: [],
      queryFn: () =>
        store.client.query({
          query: gql`
            query TreeWlFolderQuery(
              $adressesFilter: AdresseFilter!
              $apberrelevantGrundWertesFilter: TpopApberrelevantGrundWerteFilter!
              $ekAbrechnungstypWertesFilter: EkAbrechnungstypWerteFilter!
              $tpopkontrzaehlEinheitWertesFilter: TpopkontrzaehlEinheitWerteFilter!
            ) {
              allAdresses(filter: $adressesFilter) {
                totalCount
              }
              allTpopApberrelevantGrundWertes(
                filter: $apberrelevantGrundWertesFilter
              ) {
                totalCount
              }
              allEkAbrechnungstypWertes(filter: $ekAbrechnungstypWertesFilter) {
                totalCount
              }
              allTpopkontrzaehlEinheitWertes(
                filter: $tpopkontrzaehlEinheitWertesFilter
              ) {
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
          },
          fetchPolicy: 'no-cache',
        }),
    })
    const adressenFolderNode = await adresseFolder({
      count: data?.allAdresses?.totalCount ?? 0,
      loading: isLoading,
      store,
      treeQueryVariables,
    })
    const apberrelevantGrundWerteFolderNode =
      await apberrelevantGrundWerteFolder({
        count: data?.allTpopApberrelevantGrundWertes?.totalCount ?? 0,
        loading: isLoading,
        store,
        treeQueryVariables,
      })
    const ekAbrechnungstypWerteFolderNode = await ekAbrechnungstypWerteFolder({
      count: data?.allEkAbrechnungstypWertes?.totalCount ?? 0,
      loading: isLoading,
      store,
      treeQueryVariables,
    })
    const tpopkontrzaehlEinheitWerteFolderNode =
      await tpopkontrzaehlEinheitWerteFolder({
        count: data?.allTpopkontrzaehlEinheitWertes?.totalCount ?? 0,
        loading: isLoading,
        store,
        treeQueryVariables,
      })
    children = [
      adressenFolderNode,
      apberrelevantGrundWerteFolderNode,
      ekAbrechnungstypWerteFolderNode,
      tpopkontrzaehlEinheitWerteFolderNode,
    ]
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'wlFolder',
      id: 'wlFolder',
      urlLabel: 'Werte-Listen',
      label: `Werte-Listen`,
      url: ['Werte-Listen'],
      hasChildren: true,
      children,
    },
  ]
}

export default wlFolderNodes
