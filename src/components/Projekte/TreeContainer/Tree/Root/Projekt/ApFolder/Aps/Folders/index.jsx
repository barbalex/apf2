import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../../../../storeContext'
import PopFolder from './Pop'
import ApZielFolder from './ApZiel'
import ApErfkritFolder from './ApErfkrit'
import ApBerFolder from './ApBer'
import IdealbiotopFolder from './Idealbiotop'
import ApArtFolder from './ApArt'
import AssozArtFolder from './AssozArt'
import EkFrequenzFolder from './EkFrequenz'
import EkZaehleinheitFolder from './EkZaehleinheit'
import BeobNichtBeurteiltFolder from './BeobNichtBeurteilt'
import BeobNichtZuzuordnenFolder from './BeobNichtZuzuordnen'
import Qk from './Qk'

const ApFolders = ({ ap, projekt }) => {
  const client = useApolloClient()
  const store = useContext(storeContext)
  const { nodeLabelFilter, beobGqlFilterForTree, popGqlFilterForTree } =
    store.tree

  const popsFilter = popGqlFilterForTree
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
  const beobNichtBeurteiltsFilter = beobGqlFilterForTree('nichtBeurteilt')
  const beobNichtZuzuordnensFilter = beobGqlFilterForTree('nichtZuzuordnen')
  const apartsFilter = { apId: { equalTo: ap.id } }
  if (nodeLabelFilter.apart) {
    apartsFilter.label = { includesInsensitive: nodeLabelFilter.apart }
  }

  const { data, isLoading } = useQuery({
    queryKey: [
      'treeApFolders',
      projekt.id,
      ap.id,
      popsFilter,
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
            $erfkritsFilter: ErfkritFilter!
            $apbersFilter: ApberFilter!
            $apartsFilter: ApartFilter!
            $assozartFilter: AssozartFilter!
            $ekfrequenzsFilter: EkfrequenzFilter!
            $ekzaehleinheitsFilter: EkzaehleinheitFilter!
            $beobNichtBeurteiltsFilter: BeobFilter
            $beobNichtZuzuordnensFilter: BeobFilter
          ) {
            apById(id: $id) {
              id
              popsByApId(filter: $popsFilter) {
                totalCount
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
          erfkritsFilter,
          apbersFilter,
          assozartFilter,
          ekfrequenzsFilter,
          ekzaehleinheitsFilter,
          beobNichtBeurteiltsFilter,
          beobNichtZuzuordnensFilter,
          apartsFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  return (
    <>
      <PopFolder
        projekt={projekt}
        ap={ap}
        count={data?.data?.apById?.popsByApId?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <ApZielFolder projekt={projekt} ap={ap} />
      <ApErfkritFolder
        projekt={projekt}
        ap={ap}
        count={data?.data?.apById?.erfkritsByApId?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <ApBerFolder
        projekt={projekt}
        ap={ap}
        count={data?.data?.apById?.apbersByApId?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <IdealbiotopFolder projekt={projekt} ap={ap} />
      <ApArtFolder
        projekt={projekt}
        ap={ap}
        count={data?.data?.apById?.apartsByApId?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <AssozArtFolder
        projekt={projekt}
        ap={ap}
        count={data?.data?.apById?.assozartsByApId?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <EkFrequenzFolder
        projekt={projekt}
        ap={ap}
        count={data?.data?.apById?.ekfrequenzsByApId?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <EkZaehleinheitFolder
        projekt={projekt}
        ap={ap}
        count={data?.data?.apById?.ekzaehleinheitsByApId?.totalCount ?? 0}
        isLoading={isLoading}
      />
      <BeobNichtBeurteiltFolder
        projekt={projekt}
        ap={ap}
        aparts={data?.data?.apById?.beobNichtBeurteilt?.nodes ?? []}
        isLoading={isLoading}
      />
      <BeobNichtZuzuordnenFolder
        projekt={projekt}
        ap={ap}
        aparts={data?.data?.apById?.beobNichtZuzuordnen?.nodes ?? []}
        isLoading={isLoading}
      />
      <Qk projekt={projekt} ap={ap} />
    </>
  )
}

export default observer(ApFolders)
