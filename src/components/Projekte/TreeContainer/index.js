// @flow
/**
 * need to keep class because of ref
 */
import React, { Component, PropTypes } from 'react'
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

const enhance = compose(
  inject(`store`),
  observer
)

class TreeContainer extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    store: PropTypes.object.isRequired,
    tree: PropTypes.object.isRequired,
    treeName: PropTypes.string.isRequired,
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
    }
    if (Object.keys(actions).includes(action)) {
      actions[action]()
    } else {
      store.listError(new Error(`action "${action}" unknown, therefore not executed`))
    }
  }

  render() {
    const { store, tree, treeName } = this.props
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
            projektLoading={store.table.projektLoading}
            nodes={tree.node.nodes}
            mapTpopBeobVisible={store.map.activeApfloraLayers.includes(`TpopBeob`)}
            mapBeobNichtBeurteiltVisible={store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)}
            mapBeobNichtZuzuordnenVisible={store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)}
            mapPopVisible={store.map.activeApfloraLayers.includes(`Pop`)}
            mapTpopVisible={store.map.activeApfloraLayers.includes(`Tpop`)}
            popHighlightedIdsString={store.map.pop.highlightedIds.join()}
            activeNodeArray={toJS(tree.activeNodeArray)}
            tree={tree}
            treeName={treeName}
          />
        </div>
        <CmApFolder onClick={this.handleClick} treeName={treeName} />
        <CmAp onClick={this.handleClick} treeName={treeName} />
        <CmApberuebersichtFolder onClick={this.handleClick} treeName={treeName} />
        <CmApberuebersicht onClick={this.handleClick} treeName={treeName} />
        <CmAssozartFolder onClick={this.handleClick} treeName={treeName} />
        <CmAssozart onClick={this.handleClick} treeName={treeName} />
        <CmTpopbeobFolder onClick={this.handleClick} treeName={treeName} />
        <CmBerFolder onClick={this.handleClick} treeName={treeName} />
        <CmBer onClick={this.handleClick} treeName={treeName} />
        <CmApberFolder onClick={this.handleClick} treeName={treeName} />
        <CmApber onClick={this.handleClick} treeName={treeName} />
        <CmErfkritFolder onClick={this.handleClick} treeName={treeName} />
        <CmErfkrit onClick={this.handleClick} treeName={treeName} />
        <CmZielFolder onClick={this.handleClick} treeName={treeName} />
        <CmZielJahrFolder onClick={this.handleClick} treeName={treeName} />
        <CmZiel onClick={this.handleClick} treeName={treeName} />
        <CmZielBerFolder onClick={this.handleClick} treeName={treeName} />
        <CmZielBer onClick={this.handleClick} treeName={treeName} />
        <CmPopFolder onClick={this.handleClick} treeName={treeName} />
        <CmPop onClick={this.handleClick} treeName={treeName} />
        <CmPopmassnberFolder onClick={this.handleClick} treeName={treeName} />
        <CmPopmassnber onClick={this.handleClick} treeName={treeName} />
        <CmPopberFolder onClick={this.handleClick} treeName={treeName} />
        <CmPopber onClick={this.handleClick} treeName={treeName} />
        <CmTpopFolder onClick={this.handleClick} treeName={treeName} />
        <CmTpop onClick={this.handleClick} treeName={treeName} />
        <CmTpopberFolder onClick={this.handleClick} treeName={treeName} />
        <CmTpopber onClick={this.handleClick} treeName={treeName} />
        <CmTpopfreiwkontrFolder onClick={this.handleClick} treeName={treeName} />
        <CmTpopfreiwkontr onClick={this.handleClick} treeName={treeName} />
        <CmTpopfreiwkontrzaehlFolder onClick={this.handleClick} treeName={treeName} />
        <CmTpopfreiwkontrzaehl onClick={this.handleClick} treeName={treeName} />
        <CmTpopfeldkontrFolder onClick={this.handleClick} treeName={treeName} />
        <CmTpopfeldkontr onClick={this.handleClick} treeName={treeName} />
        <CmTpopfeldkontrzaehlFolder onClick={this.handleClick} treeName={treeName} />
        <CmTpopfeldkontrzaehl onClick={this.handleClick} treeName={treeName} />
        <CmTpopmassnberFolder onClick={this.handleClick} treeName={treeName} />
        <CmTpopmassnber onClick={this.handleClick} treeName={treeName} />
        <CmTpopmassnFolder onClick={this.handleClick} treeName={treeName} />
        <CmTpopmassn onClick={this.handleClick} treeName={treeName} />
      </Container>
    )
  }
}

export default enhance(TreeContainer)
