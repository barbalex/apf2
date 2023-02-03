import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'

import storeContext from '../../../../../../../../../storeContext'
import PopFolder from './Pop'

const ApFolders = ({ ap, projekt }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter, beobGqlFilter, openNodes } = store.tree

  const popsFilter = store.tree.popGqlFilter.filtered
  const zielsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.ziel) {
    zielsFilter.label = {
      includesInsensitive: nodeLabelFilter.ziel,
    }
  }
  const erfkritsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.erfkrit) {
    erfkritsFilter.label = {
      includesInsensitive: nodeLabelFilter.erfkrit,
    }
  }
  const apbersFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.apber) {
    apbersFilter.label = { includesInsensitive: nodeLabelFilter.apber }
  }
  const assozartFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.assozart) {
    assozartFilter.label = {
      includesInsensitive: nodeLabelFilter.assozart,
    }
  }
  const ekfrequenzsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.ekfrequenz) {
    ekfrequenzsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekfrequenz,
    }
  }
  const ekzaehleinheitsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.ekzaehleinheit) {
    ekzaehleinheitsFilter.label = {
      includesInsensitive: nodeLabelFilter.ekzaehleinheit,
    }
  }
  const beobNichtBeurteiltsFilter = beobGqlFilter('nichtBeurteilt').filtered
  const beobNichtZuzuordnensFilter = beobGqlFilter('nichtZuzuordnen').filtered
  const apartsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.apart) {
    apartsFilter.label = { includesInsensitive: nodeLabelFilter.apart }
  }

  const isOpen =
    openNodes.filter(
      (n) =>
        n[0] === 'Projekte' &&
        n[1] === projekt.id &&
        n[2] === 'Arten' &&
        n[3] === ap.id,
    ).length > 0

  console.log('ApFolders', { ap, projekt, isOpen })

  const { data, isLoading } = useQuery({
    queryKey: [
      'treeApFolders',
      projekt.id,
      ap.id,
      popsFilter,
      zielsFilter,
      erfkritsFilter,
      apbersFilter,
      assozartFilter,
      ekfrequenzsFilter,
      ekzaehleinheitsFilter,
      beobNichtBeurteiltsFilter,
      beobNichtZuzuordnensFilter,
      apartsFilter,
    ],
    queryFn: () =>
      client.query({
        query: gql`
          query TreeApFoldersQuery(
            $id: UUID!
            $popsFilter: PopFilter!
            $zielsFilter: ZielFilter!
            $erfkritsFilter: ErfkritFilter!
            $apbersFilter: ApberFilter!
            $apartsFilter: ApartFilter!
            $assozartFilter: AssozartFilter!
            $ekfrequenzsFilter: EkfrequenzFilter!
            $ekzaehleinheitsFilter: EkzaehleinheitFilter!
            $beobNichtBeurteiltsFilter: BeobFilter
            $beobNichtZuzuordnensFilter: BeobFilter
            $isOpen: Boolean!
          ) {
            apById(id: $id) @include(if: $isOpen) {
              id
              popsByApId(filter: $popsFilter) {
                totalCount
              }
              zielsByApId(filter: $zielsFilter) {
                nodes {
                  id
                  jahr
                }
              }
              erfkritsByApId(filter: $erfkritsFilter) {
                totalCount
              }
              apbersByApId(filter: $apbersFilter) {
                totalCount
              }
              apartsByApId(filter: $apartsFilter) {
                totalCount
              }
              assozartsByApId(filter: $assozartFilter) {
                totalCount
              }
              ekfrequenzsByApId(filter: $ekfrequenzsFilter) {
                totalCount
              }
              ekzaehleinheitsByApId(filter: $ekzaehleinheitsFilter) {
                totalCount
              }
              beobNichtBeurteilt: apartsByApId {
                nodes {
                  id
                  aeTaxonomyByArtId {
                    id
                    beobsByArtId(filter: $beobNichtBeurteiltsFilter) {
                      totalCount
                    }
                  }
                }
              }
              beobNichtZuzuordnen: apartsByApId {
                nodes {
                  id
                  aeTaxonomyByArtId {
                    id
                    beobsByArtId(filter: $beobNichtZuzuordnensFilter) {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          id: ap.id,
          popsFilter,
          zielsFilter,
          erfkritsFilter,
          apbersFilter,
          assozartFilter,
          ekfrequenzsFilter,
          ekzaehleinheitsFilter,
          beobNichtBeurteiltsFilter,
          beobNichtZuzuordnensFilter,
          apartsFilter,
          isOpen,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  if (!isOpen) return null

  return (
    <>
      <PopFolder
        ap={ap}
        projekt={projekt}
        count={data?.data?.apById?.popsByApId?.totalCount ?? 0}
        isLoading={isLoading}
      />
    </>
  )
}

export default ApFolders
