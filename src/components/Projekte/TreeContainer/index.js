// @flow
/**
 * need to keep class because of ref
 */
import React, { Component } from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import Toggle from 'material-ui/Toggle'
import clone from 'lodash/clone'

import Label from '../../shared/Label'
import LabelFilter from './LabelFilter'
import Tree from './Tree'
import CmApFolder from './contextmenu/ApFolder'
import CmAp from './contextmenu/Ap'
import CmApberuebersichtFolder from './contextmenu/ApberuebersichtFolder'
import CmApberuebersicht from './contextmenu/Apberuebersicht'
import CmAssozartFolder from './contextmenu/AssozartFolder'
import CmAssozart from './contextmenu/Assozart'
import CmTpopbeobFolder from './contextmenu/TpopbeobFolder'
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
import CmTpopbeob from './contextmenu/Tpopbeob'
import CmBeobnichtbeurteilt from './contextmenu/Beobnichtbeurteilt'
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

const Container = styled(({ exporte, children, ...rest }) => <div {...rest}>{children}</div>)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-grow: ${(props) => (props.exporte ? 0 : 1)};
  flex-shrink: ${(props) => (props.exporte ? 0 : 1)};
  flex-basis: ${(props) => (props.exporte ? `200px` : `500px`)};
  border-color: #424242;
  border-width: 1px;
  border-style: solid;
  @media print {
    display: none !important;
  }
`
const LabelFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const NurApDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  min-width: 40px;
`
const ApDivToggle = styled(Toggle)`
  margin-left: -10px;
`
const apDivToggleThumbStyle = { backgroundColor: `rgb(245, 245, 245)` }
const strukturbaumContainerDivStyle = {
  flexGrow: 1,
  flexBasis: `100%`,
}

const getAndValidateCoordinatesOfTpop = (store, id) => {
  const myId = parseInt(id, 10)
  const tpop = store.table.tpop.get(myId)
  if (!tpop) {
    store.listError(new Error(`Die Teilpopulation mit der ID ${myId} wurde nicht gefunden`))
    return { x: null, y: null }
  }
  const x = tpop.TPopXKoord
  const y = tpop.TPopYKoord
  if (!x || !y) {
    store.listError(new Error(`Die Teilpopulation mit der ID ${myId} kat keine (vollständigen) Koordinaten`))
    return { x: null, y: null }
  }
  return { x, y }
}

const enhance = compose(
  inject(`store`),
  observer
)

class TreeContainer extends Component {

  props: {
    store: Object,
    tree: Object,
  }

  showMapIfNotYetVisible = () => {
    const { store } = this.props
    const projekteTabs = clone(toJS(store.urlQuery.projekteTabs))
    const isVisible = projekteTabs.includes(`karte`)
    if (!isVisible) {
      projekteTabs.push(`karte`)
      store.setUrlQueryValue(`projekteTabs`, projekteTabs)
    }
  }

  handleClick = (e, data, element) => {
    const { store, tree } = this.props
    if (!data) return store.listError(new Error(`no data passed with click`))
    if (!element) return store.listError(new Error(`no element passed with click`))
    const { table, action, idTable, actionTable } = data
    const { firstElementChild } = element
    if (!firstElementChild) return store.listError(new Error(`no firstElementChild passed with click`))
    const id = firstElementChild.getAttribute(`data-id`)
    const parentId = firstElementChild.getAttribute(`data-parentId`)
    const url = firstElementChild.getAttribute(`data-url`)
    const label = firstElementChild.getAttribute(`data-label`)
    const baseUrl = JSON.parse(url)
    const nodeType = firstElementChild.getAttribute(`data-nodeType`)
    const menuType = firstElementChild.getAttribute(`data-menuType`)
    const that = this
    const actions = {
      insert() {
        if (nodeType === `table`) {
          baseUrl.pop()
        }
        if (menuType === `zielFolder`) {
          // db sets year 1 as standard
          baseUrl.push(1)
        }
        const idToPass = parentId || id
        store.insertDataset(tree, table, idToPass, baseUrl)
      },
      delete() {
        store.deleteDatasetDemand(table, id, baseUrl, label)
      },
      showBeobOnMap() {
        // 1. open map if not yet open
        that.showMapIfNotYetVisible()
        // 2 add layer for actionTable
        store.map.showMapLayer(actionTable, !store.map.activeOverlays.includes(actionTable))
      },
      showOnMap() {
        // actionTable: table to show on map
        // idTable: table from which to filter datasets of actionTable
        // 1. load missing data if necessary
        if (idTable === `ap`) {
          store.map.pop.apArtId = parseInt(id, 10)
          store.fetchTableByParentId(`apflora`, `pop`, id)
          store.fetchTpopForAp(id)
        }
        if (actionTable === `tpop`) {
          store.fetchTpopForAp(id)
        }
        // 2. open map if not yet open
        that.showMapIfNotYetVisible()
        // 3 add layer for actionTable
        store.map.showMapLayer(actionTable, !store.map.activeOverlays.includes(actionTable))
      },
      toggleTooltip() {
        store.map.toggleMapPopLabelContent(actionTable)
      },
      localizeOnMap() {
        store.map.setIdOfTpopBeingLocalized(parseInt(id, 10))
        that.showMapIfNotYetVisible()
        store.map.showMapApfloraLayer(`Tpop`, true)
      },
      markForMoving() {
        store.markForMoving(table, parseInt(id, 10), label)
      },
      move() {
        store.moveTo(parseInt(id, 10))
      },
      markForCopying() {
        store.markForCopying(table, parseInt(id, 10), label)
      },
      resetCopying() {
        store.resetCopying()
      },
      copy() {
        store.copyTo(parseInt(id, 10))
      },
      markForCopyingBiotop() {
        store.markForCopyingBiotop(parseInt(id, 10), label)
      },
      resetCopyingBiotop() {
        store.resetCopyingBiotop()
      },
      copyBiotop() {
        store.copyBiotopTo(parseInt(id, 10))
      },
      copyTpopKoordToPop() {
        store.copyTpopKoordToPop(parseInt(id, 10))
      },
      createNewPopFromBeob() {
        store.createNewPopFromBeob(tree, id)
      },
      showCoordOfTpopOnMapsZhCh() {
        const { x, y } = getAndValidateCoordinatesOfTpop(store, parseInt(id, 10))
        if (x && y) {
          store.showCoordOnMapsZhCh(x, y)
        }
      },
      showCoordOfTpopOnMapGeoAdminCh() {
        const { x, y } = getAndValidateCoordinatesOfTpop(store, parseInt(id, 10))
        if (x && y) {
          store.showCoordOnMapGeoAdminCh(x, y)
        }
      }
    }
    if (Object.keys(actions).includes(action)) {
      actions[action]()
    } else {
      store.listError(new Error(`action "${action}" unknown, therefore not executed`))
    }
  }

  render() {
    const { store, tree } = this.props
    const { activeDataset } = store.tree
    const showApDivToggle = activeDataset

    return (
      <Container exporte={tree.activeNodes.exporte}>
        <LabelFilterContainer>
          <LabelFilter tree={tree} />
          {
            showApDivToggle &&
            <NurApDiv>
              <Label label="nur AP" />
              <ApDivToggle
                toggled={tree.apFilter}
                thumbStyle={apDivToggleThumbStyle}
                onToggle={tree.toggleApFilter}
              />
            </NurApDiv>
          }
        </LabelFilterContainer>
        <div
          style={strukturbaumContainerDivStyle}
          // $FlowIssue
          ref={(c) => { this.tree = c }}
        >
          <Tree
            tree={tree}
            projektLoading={store.table.projektLoading}
            nodes={tree.node.nodes}
            mapTpopBeobVisible={store.map.activeApfloraLayers.includes(`TpopBeob`)}
            mapBeobNichtBeurteiltVisible={store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)}
            mapBeobNichtZuzuordnenVisible={store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)}
            mapPopVisible={store.map.activeApfloraLayers.includes(`Pop`)}
            mapTpopVisible={store.map.activeApfloraLayers.includes(`Tpop`)}
            popHighlightedIdsString={store.map.pop.highlightedIds.join()}
            activeNodeArray={toJS(tree.activeNodeArray)}

          />
        </div>
        <CmApFolder onClick={this.handleClick} tree={tree} />
        <CmAp onClick={this.handleClick} tree={tree} />
        <CmApberuebersichtFolder onClick={this.handleClick} tree={tree} />
        <CmApberuebersicht onClick={this.handleClick} tree={tree} />
        <CmAssozartFolder onClick={this.handleClick} tree={tree} />
        <CmAssozart onClick={this.handleClick} tree={tree} />
        <CmTpopbeobFolder onClick={this.handleClick} tree={tree} />
        <CmBerFolder onClick={this.handleClick} tree={tree} />
        <CmBer onClick={this.handleClick} tree={tree} />
        <CmApberFolder onClick={this.handleClick} tree={tree} />
        <CmApber onClick={this.handleClick} tree={tree} />
        <CmErfkritFolder onClick={this.handleClick} tree={tree} />
        <CmErfkrit onClick={this.handleClick} tree={tree} />
        <CmZielFolder onClick={this.handleClick} tree={tree} />
        <CmZielJahrFolder onClick={this.handleClick} tree={tree} />
        <CmZiel onClick={this.handleClick} tree={tree} />
        <CmZielBerFolder onClick={this.handleClick} tree={tree} />
        <CmZielBer onClick={this.handleClick} tree={tree} />
        <CmPopFolder onClick={this.handleClick} tree={tree} />
        <CmPop onClick={this.handleClick} tree={tree} />
        <CmPopmassnberFolder onClick={this.handleClick} tree={tree} />
        <CmPopmassnber onClick={this.handleClick} tree={tree} />
        <CmPopberFolder onClick={this.handleClick} tree={tree} />
        <CmPopber onClick={this.handleClick} tree={tree} />
        <CmTpopFolder onClick={this.handleClick} tree={tree} />
        <CmTpop onClick={this.handleClick} tree={tree} />
        <CmTpopberFolder onClick={this.handleClick} tree={tree} />
        <CmTpopber onClick={this.handleClick} tree={tree} />
        <CmTpopbeob onClick={this.handleClick} tree={tree} />
        <CmBeobnichtbeurteilt onClick={this.handleClick} tree={tree} />
        <CmTpopfreiwkontrFolder onClick={this.handleClick} tree={tree} />
        <CmTpopfreiwkontr onClick={this.handleClick} tree={tree} />
        <CmTpopfreiwkontrzaehlFolder onClick={this.handleClick} tree={tree} />
        <CmTpopfreiwkontrzaehl onClick={this.handleClick} tree={tree} />
        <CmTpopfeldkontrFolder onClick={this.handleClick} tree={tree} />
        <CmTpopfeldkontr onClick={this.handleClick} tree={tree} />
        <CmTpopfeldkontrzaehlFolder onClick={this.handleClick} tree={tree} />
        <CmTpopfeldkontrzaehl onClick={this.handleClick} tree={tree} />
        <CmTpopmassnberFolder onClick={this.handleClick} tree={tree} />
        <CmTpopmassnber onClick={this.handleClick} tree={tree} />
        <CmTpopmassnFolder onClick={this.handleClick} tree={tree} />
        <CmTpopmassn onClick={this.handleClick} tree={tree} />
      </Container>
    )
  }
}

export default enhance(TreeContainer)
