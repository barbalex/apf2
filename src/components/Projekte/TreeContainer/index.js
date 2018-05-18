// @flow
/**
 * need to keep class because of ref
 */
import React from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import Switch from '@material-ui/core/Switch'
import clone from 'lodash/clone'
import get from 'lodash/get'
import { Query } from 'react-apollo'
import gql from "graphql-tag"

import variables from './variables'
import dataGql from './data.graphql'
import buildNodes from './nodes'
import Label from '../../shared/Label'
import LabelFilter from './LabelFilter'
import Tree from './Tree'
import CmApFolder from './contextmenu/ApFolder'
import CmAp from './contextmenu/Ap'
import CmApberuebersichtFolder from './contextmenu/ApberuebersichtFolder'
import CmApberuebersicht from './contextmenu/Apberuebersicht'
import CmAssozartFolder from './contextmenu/AssozartFolder'
import CmAssozart from './contextmenu/Assozart'
import CmApartFolder from './contextmenu/ApartFolder'
import CmApart from './contextmenu/Apart'
import CmBeobZugeordnetFolder from './contextmenu/BeobZugeordnetFolder'
import CmBerFolder from './contextmenu/BerFolder'
import CmBer from './contextmenu/Ber'
import CmApberFolder from './contextmenu/ApberFolder'
import CmApber from './contextmenu/Apber'
import CmErfkritFolder from './contextmenu/ErfkritFolder'
import CmErfkrit from './contextmenu/Erfkrit'
import CmZielFolder from './contextmenu/ZielFolder'
import CmZielJahrFolder from './contextmenu/ZielJahrFolder'
import CmZiel from './contextmenu/Ziel'
import CmZielBerFolder from './contextmenu/ZielBerFolder'
import CmZielBer from './contextmenu/Zielber'
import CmPopFolder from './contextmenu/PopFolder'
import CmPop from './contextmenu/Pop'
import CmPopmassnberFolder from './contextmenu/PopmassnberFolder'
import CmPopmassnber from './contextmenu/Popmassnber'
import CmPopberFolder from './contextmenu/PopberFolder'
import CmPopber from './contextmenu/Popber'
import CmTpopFolder from './contextmenu/TpopFolder'
import CmTpop from './contextmenu/Tpop'
import CmTpopberFolder from './contextmenu/TpopberFolder'
import CmTpopber from './contextmenu/Tpopber'
import CmBeobZugeordnet from './contextmenu/BeobZugeordnet'
import CmBeobnichtbeurteilt from './contextmenu/Beobnichtbeurteilt'
import CmBeobNichtZuzuordnen from './contextmenu/BeobNichtZuzuordnen'
import CmTpopfreiwkontrFolder from './contextmenu/TpopfreiwkontrFolder'
import CmTpopfreiwkontr from './contextmenu/Tpopfreiwkontr'
import CmTpopfreiwkontrzaehlFolder from './contextmenu/TpopfreiwkontrzaehlFolder'
import CmTpopfreiwkontrzaehl from './contextmenu/Tpopfreiwkontrzaehl'
import CmTpopfeldkontrFolder from './contextmenu/TpopfeldkontrFolder'
import CmTpopfeldkontr from './contextmenu/Tpopfeldkontr'
import CmTpopfeldkontrzaehlFolder from './contextmenu/TpopfeldkontrzaehlFolder'
import CmTpopfeldkontrzaehl from './contextmenu/Tpopfeldkontrzaehl'
import CmTpopmassnberFolder from './contextmenu/TpopmassnberFolder'
import CmTpopmassnber from './contextmenu/Tpopmassnber'
import CmTpopmassnFolder from './contextmenu/TpopmassnFolder'
import CmTpopmassn from './contextmenu/Tpopmassn'
import DeleteDatasetModal from './DeleteDatasetModal'
import ErrorBoundary from '../../shared/ErrorBoundarySingleChild'
import copyBiotopTo from '../../../modules/copyBiotopTo'
import setUrlQueryValue from '../../../modules/setUrlQueryValue'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-right-color: rgb(46, 125, 50);
  border-right-width: 1px;
  border-right-style: solid;
  border-left-color: rgb(46, 125, 50);
  border-left-width: 1px;
  border-left-style: solid;
  overflow: hidden;
  @media print {
    display: none !important;
  }
`
const LabelFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 12px;
  padding-top: 5px;
`
const NurApDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  min-width: 40px;
`
const StyledSwitch = styled(Switch)`
  margin-left: -13px;
  margin-top: -18px;
`
const InnerTreeContainer = styled.div`
  height: 100%;
  overflow: hidden;
`

const getAndValidateCoordinatesOfTpop = (store, id) => {
  const tpop = store.table.tpop.get(id)
  if (!tpop) {
    store.listError(
      new Error(`Die Teilpopulation mit der ID ${id} wurde nicht gefunden`)
    )
    return { x: null, y: null }
  }
  const x = tpop.x
  const y = tpop.y
  if (!x || !y) {
    store.listError(
      new Error(
        `Die Teilpopulation mit der ID ${id} kat keine (vollständigen) Koordinaten`
      )
    )
    return { x: null, y: null }
  }
  return { x, y }
}

const getAndValidateCoordinatesOfBeob = (store, beobId) => {
  const beob = store.table.beob.get(beobId)
  if (!beob) {
    store.listError(
      new Error(
        `Die bereitgestellte Beobachtung mit der ID ${beobId} wurde nicht gefunden`
      )
    )
    return { x: null, y: null }
  }
  const { x, y } = beob
  if (!x || !y) {
    store.listError(
      new Error(
        `Die Teilpopulation mit der ID ${beobId} kat keine (vollständigen) Koordinaten`
      )
    )
    return { x: null, y: null }
  }
  return { x, y }
}

const showMapIfNotYetVisible = ({
  client,
  projekteTabs
}: {
  client: Object,
  projekteTabs: Array<String>
}) => {
  const isVisible = projekteTabs.includes('karte')
  if (!isVisible) {
    projekteTabs.push('karte')
    setUrlQueryValue({ client, key: 'projekteTabs', value: projekteTabs})
  }
}

const enhance = compose(
  inject('store'),
  withHandlers({
    handleClick: ({ store, tree }) => ({ data, element, nodes, client }) => {
      if (!data) return store.listError(new Error('no data passed with click'))
      if (!element)
        return store.listError(new Error('no element passed with click'))
      const { table, action, actionTable } = data
      const { firstElementChild } = element
      if (!firstElementChild)
        return store.listError(
          new Error('no firstElementChild passed with click')
        )
      let id = firstElementChild.getAttribute('data-id')
      if (!isNaN(id)) id = +id
      const parentId = firstElementChild.getAttribute('data-parentid')
      const url = firstElementChild.getAttribute('data-url')
      const label = firstElementChild.getAttribute('data-label')
      const baseUrl = JSON.parse(url)
      const nodeType = firstElementChild.getAttribute('data-nodetype')
      const menuType = firstElementChild.getAttribute('data-menutype')
      const actions = {
        insert() {
          if (nodeType === 'table') {
            baseUrl.pop()
          }
          if (menuType === 'zielFolder') {
            // db sets year 1 as standard
            baseUrl.push(1)
          }
          const idToPass = parentId || id
          store.insertDataset(tree, table, idToPass, baseUrl)
        },
        openLowerNodes() {
          tree.toggleNextLowerNodes({ tree, id, menuType, nodes })
        },
        delete() {
          store.deleteDatasetDemand(table, id, baseUrl, label)
        },
        showBeobOnMap() {
          const projekteTabs = get(data, 'urlQuery.projekteTabs', [])
          // 1. open map if not yet open
          showMapIfNotYetVisible({ client, projekteTabs })
          // 2 add layer for actionTable
          store.map.showMapLayer(
            actionTable,
            !store.map.activeOverlays.includes(actionTable)
          )
        },
        toggleTooltip() {
          store.map.toggleMapPopLabelContent(actionTable)
        },
        localizeOnMap() {
          const projekteTabs = get(data, 'urlQuery.projekteTabs', [])
          store.map.setIdOfTpopBeingLocalized(id)
          showMapIfNotYetVisible({ client, projekteTabs })
          store.map.showMapApfloraLayer('Tpop', true)
        },
        markForMoving() {
          store.markForMoving(table, id, label)
        },
        move() {
          store.moveTo(id)
        },
        markForCopying() {
          store.markForCopying(table, id, label)
        },
        markForCopyingWithNextLevel() {
          store.markForCopying(table, id, label, true)
        },
        resetCopying() {
          store.resetCopying()
        },
        copy() {
          store.copyTo(id)
        },
        markForCopyingBiotop() {
          client.mutate({
            mutation: gql`
              mutation setCopyingBiotop($id: UUID!, $label: String!) {
                setCopyingBiotop(id: $id, label: $label) @client {
                  id
                  label
                }
              }
            `,
            variables: { id, label }
          })
        },
        resetCopyingBiotop() {
          client.mutate({
            mutation: gql`
              mutation setCopyingBiotop($id: UUID, $label: String) {
                setCopyingBiotop(id: $id, label: $label) @client {
                  id
                  label
                }
              }
            `,
            variables: { id: 'copyingBiotop', label: null }
          })
        },
        copyBiotop() {
          copyBiotopTo({ id, client })
        },
        copyTpopKoordToPop() {
          store.copyTpopKoordToPop(id)
        },
        createNewPopFromBeob() {
          store.createNewPopFromBeob(tree, id)
        },
        copyBeobZugeordnetKoordToPop() {
          store.copyBeobZugeordnetKoordToPop(id)
        },
        showCoordOfTpopOnMapsZhCh() {
          const { x, y } = getAndValidateCoordinatesOfTpop(store, id)
          if (x && y) {
            window.open(
              `https://maps.zh.ch/?x=${x}&y=${y}&scale=3000&markers=ring`,
              'target="_blank"'
            )
          }
        },
        showCoordOfTpopOnMapGeoAdminCh() {
          const { x, y } = getAndValidateCoordinatesOfTpop(store, id)
          if (x && y) {
            window.open(
              `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${x}&X=${y}&zoom=10&crosshair=circle`,
              'target="_blank"'
            )
          }
        },
        showCoordOfBeobOnMapsZhCh() {
          const { x, y } = getAndValidateCoordinatesOfBeob(store, id)
          if (x && y) {
            window.open(
              `https://maps.zh.ch/?x=${x}&y=${y}&scale=3000&markers=ring`,
              'target="_blank"'
            )
          }
        },
        showCoordOfBeobOnMapGeoAdminCh() {
          const { x, y } = getAndValidateCoordinatesOfBeob(store, id)
          if (x && y) {
            window.open(
              `https://map.geo.admin.ch/?bgLayer=ch.swisstopo.pixelkarte-farbe&Y=${x}&X=${y}&zoom=10&crosshair=circle`,
              'target="_blank"'
            )
          }
        },
      }
      if (Object.keys(actions).includes(action)) {
        actions[action]()
      } else {
        store.listError(
          new Error(`action "${action}" unknown, therefore not executed`)
        )
      }
    },
  }),
  observer
)

const TreeContainer = ({
  store,
  tree,
  handleClick,
}: {
  store: Object,
  tree: Object,
  handleClick: () => void,
}) => {
  const { activeDataset,activeNodes,setActiveNodeArray,openNodes } = store.tree
  const showApDivToggle = activeDataset
  const deleteDatasetModalIsVisible = !!store.datasetToDelete.id

  return (
    <Query query={dataGql} variables={variables(activeNodes)}>
      {({ loading, error, data, client }) => {
        // do not show loading but rather last state
        //if (loading) return <Container>Lade...</Container>
        if (error) return `Fehler: ${error.message}`

        const nodes = buildNodes({ store, tree, data })
        const token = get(data, 'user.token', null)
        const activeNodeArray = get(data, 'tree.activeNodeArray')

        // if activeNodeArray.length === 1
        // and there is only one projekte
        // open it
        // TODO: need to do this on componentWillMount?
        const projekteNodes = nodes.filter(n => n.menuType === 'projekt').length === 1
        const existsOnlyOneProjekt = projekteNodes.length === 1
        if (activeNodes.projektfolder && !activeNodes.projekt && existsOnlyOneProjekt) {
          const projektNode = projekteNodes[0]
          if (projektNode) {
            const projektUrl = clone(projektNode.url)
            setActiveNodeArray(projektUrl)
            openNodes.push(projektUrl)
          }
        }

        return (
          <ErrorBoundary>
            <Container>
              {deleteDatasetModalIsVisible && (
                <DeleteDatasetModal tree={tree} token={token} />
              )}
              <LabelFilterContainer>
                <LabelFilter tree={tree} token={token} />
                {showApDivToggle && (
                  <NurApDiv>
                    <Label label="nur AP" />
                    <StyledSwitch
                      checked={tree.apFilter}
                      onChange={tree.toggleApFilter}
                      color="primary"
                    />
                  </NurApDiv>
                )}
              </LabelFilterContainer>
              <InnerTreeContainer
                // $FlowIssue
                innerRef={c => (this.tree = c)}
              >
                <Tree
                  data={data}
                  tree={tree} token={token}
                  projektLoading={store.table.projektLoading}
                  nodes={nodes}
                  mapBeobZugeordnetVisible={store.map.activeApfloraLayers.includes(
                    'BeobZugeordnet'
                  )}
                  mapBeobNichtBeurteiltVisible={store.map.activeApfloraLayers.includes(
                    'BeobNichtBeurteilt'
                  )}
                  mapBeobNichtZuzuordnenVisible={store.map.activeApfloraLayers.includes(
                    'BeobNichtZuzuordnen'
                  )}
                  mapPopVisible={store.map.activeApfloraLayers.includes('Pop')}
                  mapTpopVisible={store.map.activeApfloraLayers.includes(
                    'Tpop'
                  )}
                  popHighlightedIdsString={store.map.pop.highlightedIds.join()}
                  activeNodeArray={activeNodeArray}
                  openNodes={tree.openNodes}
                />
              </InnerTreeContainer>
              <CmApFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmAp onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmApberuebersichtFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmApberuebersicht onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmAssozartFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmAssozart onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmApartFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmApart onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmBeobZugeordnetFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmBerFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmBer onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmApberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmApber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmErfkritFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmErfkrit onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmZielFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmZielJahrFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmZiel onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmZielBerFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmZielBer onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmPopFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmPop onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmPopmassnberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmPopmassnber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmPopberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmPopber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpop onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmBeobZugeordnet onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmBeobnichtbeurteilt onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmBeobNichtZuzuordnen onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopfreiwkontrFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopfreiwkontr onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopfreiwkontrzaehlFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopfreiwkontrzaehl onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopfeldkontrFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopfeldkontr onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopfeldkontrzaehlFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopfeldkontrzaehl onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopmassnberFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopmassnber onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopmassnFolder onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
              <CmTpopmassn onClick={(e, data, element)=>handleClick({data,element,nodes,client})} tree={tree} token={token} />
            </Container>
          </ErrorBoundary>
        )
      }}
    </Query>
  )
}

export default enhance(TreeContainer)
