import { gql } from '@apollo/client'

import popFolder from './popFolder'
import apzielFolder from './apzielFolder'
import aperfkritFolder from './aperfkritFolder'
import apberFolder from './apberFolder'
import idealbiotopFolder from './idealbiotopFolder'
import assozartFolder from './assozartFolder'
import ekfrequenzFolder from './ekfrequenzFolder'
import ekzaehleinheitFolder from './ekzaehleinheitFolder'
import beobNichtBeurteiltFolder from './beobNichtBeurteiltFolder'
import beobNichtZuzuordnenFolder from './beobNichtZuzuordnenFolder'

const ap = async ({ projId, store, treeQueryVariables }) => {
  const { data } = await store.client.query({
    query: gql`
      query TreeApsQuery($apsFilter: ApFilter!, $popsFilter: PopFilter!) {
        allAps(filter: $apsFilter, orderBy: LABEL_ASC) {
          nodes {
            id
            label
            popsByApId(filter: $popsFilter) {
              totalCount
            }
          }
        }
      }
    `,
    variables: {
      apsFilter: treeQueryVariables.apsFilter,
      popsFilter: treeQueryVariables.popsFilter,
    },
  })

  const aps = data?.allAps?.nodes ?? []

  // map through all elements and create array of nodes
  let nodes = []
  for (const ap of aps) {
    if (store.tree.openAps.includes(ap.id)) {
      // 1. fetch counts for children
      const { data, loading } = await store.client.query({
        query: gql`
          query TreeApQuery(
            $id: UUID!
            $popsFilter: PopFilter!
            $zielsFilter: ZielFilter!
            $erfkritsFilter: ErfkritFilter!
            $apbersFilter: ApberFilter!
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
        },
      })
      // 2. build children
      const popFolderNode = popFolder({
        projId,
        apId: ap.id,
        store,
        count: data?.apById?.popsByApId?.totalCount ?? 0,
      })
      const apzielFolderNode = apzielFolder({
        data,
        loading,
        projId,
        apId: ap.id,
        store,
      })
      const aperfkritFolderNode = aperfkritFolder({
        loading,
        projId,
        apId: ap.id,
        store,
        count: data?.apById?.erfkritsByApId?.totalCount ?? 0,
      })
      const apberFolderNode = apberFolder({
        loading,
        projId,
        apId: ap.id,
        store,
        count: data?.apById?.apbersByApId?.totalCount ?? 0,
      })
      const idealbiotopFolderNode = idealbiotopFolder({ projId, apId: ap.id })
      const assozartFolderNode = assozartFolder({
        projId,
        apId: ap.id,
        loading,
        count: data?.apById?.assozartsByApId?.totalCount ?? 0,
        store,
      })
      const ekfrequenzFolderNode = ekfrequenzFolder({
        projId,
        apId: ap.id,
        loading,
        count: data?.apById?.ekfrequenzsByApId?.totalCount ?? 0,
        store,
      })
      const ekzaehleinheitFolderNode = ekzaehleinheitFolder({
        projId,
        apId: ap.id,
        loading,
        count: data?.apById?.ekzaehleinheitsByApId?.totalCount ?? 0,
        store,
      })
      const beobNichtBeurteiltFolderNode = beobNichtBeurteiltFolder({
        data,
        loading,
        projId,
        apId: ap.id,
        store,
      })
      const beobNichtZuzuordnenFolderNode = beobNichtZuzuordnenFolder({
        data,
        loading,
        projId,
        apId: ap.id,
        store,
      })

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
          assozartFolderNode,
          ekfrequenzFolderNode,
          ekzaehleinheitFolderNode,
          beobNichtBeurteiltFolderNode,
          beobNichtZuzuordnenFolderNode,
        ],
      })
      continue
    }
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
    })
  }

  // console.log('nodes, ap, nodes:', nodes)
  return nodes
}

export default ap
