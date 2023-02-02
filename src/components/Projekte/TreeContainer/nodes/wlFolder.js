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
    const { data, loading } = await store.client.query({
      query: gql`
        query TreeProjektQuery(
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
    })
    const adressenFolderNode = await adresseFolder({
      count: data?.allAdresses?.totalCount ?? 0,
      loading,
      store,
      treeQueryVariables,
    })
    children = [adressenFolderNode]
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
