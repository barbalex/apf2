import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'

import Row from '../../Row'
import storeContext from '../../../../../../storeContext'
import AdresseFolder from './Adresse'
import ApberrelevantGrundFolder from './ApberrelevantGrund'
import EkAbrechnungstypFolder from './EkAbrechnungstyp'
import ZaehlEinheitFolder from './ZaehlEinheit'

const WlFolderNode = () => {
  const client = useApolloClient()

  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree
  const isOpen = store.tree.openNodes.some(
    (nodeArray) => nodeArray[0] === 'Werte-Listen',
  )

  const adressesFilter = nodeLabelFilter.adresse
    ? { label: { includesInsensitive: nodeLabelFilter.adresse } }
    : { id: { isNull: false } }
  const apberrelevantGrundWertesFilter =
    nodeLabelFilter.tpopApberrelevantGrundWerte
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.tpopApberrelevantGrundWerte,
          },
        }
      : { id: { isNull: false } }
  const ekAbrechnungstypWertesFilter = nodeLabelFilter.ekAbrechnungstypWerte
    ? {
        label: { includesInsensitive: nodeLabelFilter.ekAbrechnungstypWerte },
      }
    : { id: { isNull: false } }
  const tpopkontrzaehlEinheitWertesFilter =
    nodeLabelFilter.tpopkontrzaehlEinheitWerte
      ? {
          label: {
            includesInsensitive: nodeLabelFilter.tpopkontrzaehlEinheitWerte,
          },
        }
      : { id: { isNull: false } }

  const { data, isLoading } = useQuery({
    queryKey: [
      'treeWerteFolders',
      adressesFilter,
      apberrelevantGrundWertesFilter,
      ekAbrechnungstypWertesFilter,
      tpopkontrzaehlEinheitWertesFilter,
    ],
    queryFn: () =>
      client.query({
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
          adressesFilter,
          apberrelevantGrundWertesFilter,
          ekAbrechnungstypWertesFilter,
          tpopkontrzaehlEinheitWertesFilter,
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
  const zaehlEinheitWertesCount =
    data?.data?.allTpopkontrzaehlEinheitWertes?.totalCount ?? 0

  const node = {
    nodeType: 'folder',
    menuType: 'wlFolder',
    id: 'wlFolder',
    urlLabel: 'Werte-Listen',
    label: `Werte-Listen (4)`,
    url: ['Werte-Listen'],
    hasChildren: true,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && (
        <>
          <AdresseFolder isLoading={isLoading} count={adressenCount} />
          <ApberrelevantGrundFolder
            isLoading={isLoading}
            count={apberrelevantGrundWertesCount}
          />
          <EkAbrechnungstypFolder
            isLoading={isLoading}
            count={ekAbrechnungstypWertesCount}
          />
          <ZaehlEinheitFolder
            isLoading={isLoading}
            count={zaehlEinheitWertesCount}
          />
        </>
      )}
    </>
  )
}

export default observer(WlFolderNode)
