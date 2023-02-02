import { gql } from '@apollo/client'

import popFolder from './popFolder'
import apzielFolder from './apzielFolder'
import aperfkritFolder from './aperfkritFolder'
import apberFolder from './apberFolder'
import idealbiotopFolder from './idealbiotopFolder'
import apartFolder from './apartFolder'
import assozartFolder from './assozartFolder'
import ekfrequenzFolder from './ekfrequenzFolder'
import ekzaehleinheitFolder from './ekzaehleinheitFolder'
import beobNichtBeurteiltFolder from './beobNichtBeurteiltFolder'
import beobNichtZuzuordnenFolder from './beobNichtZuzuordnenFolder'
import qkFolder from './qkFolder'

const ap = async ({ projId, store, treeQueryVariables }) => {
  // TODO: seems this query (and others) is not fetched from cache when changing between EK?
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treeAps', projId, store.dataFilter?.ap, store.apFilter],
    queryFn: () =>
      store.client.query({
        query: gql`
          query TreeApsQuery($apsFilter: ApFilter!) {
            allAps(filter: $apsFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          apsFilter: store.tree.apGqlFilter.filtered,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const aps = data?.allAps?.nodes ?? []

  // map through all elements and create array of nodes
  let nodes = []
  for (const ap of aps) {
    if (store.tree.openAps.includes(ap.id)) {
      // 1. fetch counts for children
      const { data, isLoading } = await store.queryClient.fetchQuery({
        queryKey: [
          'treeAp',
          ap.id,
          treeQueryVariables.popsFilter,
          treeQueryVariables.zielsFilter,
          treeQueryVariables.erfkritsFilter,
          treeQueryVariables.apbersFilter,
          treeQueryVariables.assozartFilter,
          treeQueryVariables.ekfrequenzsFilter,
          treeQueryVariables.ekzaehleinheitsFilter,
          treeQueryVariables.beobNichtBeurteiltsFilter,
          treeQueryVariables.beobNichtZuzuordnensFilter,
          treeQueryVariables.apartsFilter,
        ],
        queryFn: () =>
          store.client.query({
            query: gql`
              query TreeApQuery(
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
              ) {
                apById(id: $id) {
                  id
                  label
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
              popsFilter: treeQueryVariables.popsFilter,
              zielsFilter: treeQueryVariables.zielsFilter,
              erfkritsFilter: treeQueryVariables.erfkritsFilter,
              apbersFilter: treeQueryVariables.apbersFilter,
              assozartFilter: treeQueryVariables.assozartFilter,
              ekfrequenzsFilter: treeQueryVariables.ekfrequenzsFilter,
              ekzaehleinheitsFilter: treeQueryVariables.ekzaehleinheitsFilter,
              beobNichtBeurteiltsFilter:
                treeQueryVariables.beobNichtBeurteiltsFilter,
              beobNichtZuzuordnensFilter:
                treeQueryVariables.beobNichtZuzuordnensFilter,
              apartsFilter: treeQueryVariables.apartsFilter,
            },
            fetchPolicy: 'no-cache',
          }),
      })
      // 2. build children
      const popFolderNode = await popFolder({
        projId,
        apId: ap.id,
        store,
        count: data?.apById?.popsByApId?.totalCount ?? 0,
        treeQueryVariables,
      })
      const apzielFolderNode = await apzielFolder({
        projId,
        apId: ap.id,
        store,
        treeQueryVariables,
      })
      const aperfkritFolderNode = await aperfkritFolder({
        loading: isLoading,
        projId,
        apId: ap.id,
        store,
        count: data?.apById?.erfkritsByApId?.totalCount ?? 0,
        treeQueryVariables,
      })
      const apberFolderNode = await apberFolder({
        loading: isLoading,
        projId,
        apId: ap.id,
        store,
        count: data?.apById?.apbersByApId?.totalCount ?? 0,
        treeQueryVariables,
      })
      const idealbiotopFolderNode = idealbiotopFolder({ projId, apId: ap.id })
      const apartFolderNode = await apartFolder({
        count: data?.apById?.apartsByApId?.totalCount ?? 0,
        loading: isLoading,
        projId,
        apId: ap.id,
        store,
        treeQueryVariables,
      })
      const assozartFolderNode = await assozartFolder({
        projId,
        apId: ap.id,
        loading: isLoading,
        count: data?.apById?.assozartsByApId?.totalCount ?? 0,
        store,
        treeQueryVariables,
      })
      const ekfrequenzFolderNode = await ekfrequenzFolder({
        projId,
        apId: ap.id,
        loading: isLoading,
        count: data?.apById?.ekfrequenzsByApId?.totalCount ?? 0,
        store,
        treeQueryVariables,
      })
      const ekzaehleinheitFolderNode = await ekzaehleinheitFolder({
        projId,
        apId: ap.id,
        loading: isLoading,
        count: data?.apById?.ekzaehleinheitsByApId?.totalCount ?? 0,
        store,
        treeQueryVariables,
      })
      const beobNichtBeurteiltFolderNode = await beobNichtBeurteiltFolder({
        data,
        loading: isLoading,
        projId,
        apId: ap.id,
        store,
        treeQueryVariables,
      })
      const beobNichtZuzuordnenFolderNode = await beobNichtZuzuordnenFolder({
        data,
        loading: isLoading,
        projId,
        apId: ap.id,
        store,
        treeQueryVariables,
      })
      const qkFolderNode = qkFolder({ projId, apId: ap.id })

      nodes.push({
        nodeType: 'table',
        menuType: 'ap',
        filterTable: 'ap',
        id: ap.id,
        parentId: projId,
        parentTableId: projId,
        urlLabel: ap.id,
        label: ap.label,
        url: ['Projekte', projId, 'Arten', ap.id],
        hasChildren: true,
        children: [
          popFolderNode,
          apzielFolderNode,
          aperfkritFolderNode,
          apberFolderNode,
          idealbiotopFolderNode,
          apartFolderNode,
          assozartFolderNode,
          ekfrequenzFolderNode,
          ekzaehleinheitFolderNode,
          beobNichtBeurteiltFolderNode,
          beobNichtZuzuordnenFolderNode,
          qkFolderNode,
        ],
      })
      continue
    }
    nodes.push({
      nodeType: 'table',
      menuType: 'ap',
      id: ap.id,
      parentId: projId,
      parentTableId: projId,
      urlLabel: ap.id,
      label: ap.label,
      url: ['Projekte', projId, 'Arten', ap.id],
      hasChildren: true,
    })
  }

  // console.log('nodes, ap, nodes:', nodes)
  return nodes
}

export default ap
