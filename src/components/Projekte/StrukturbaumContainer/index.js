// @flow
/**
 * need to keep class because of ref
 */
import React, { Component, PropTypes } from 'react'
import { observer, inject } from 'mobx-react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import Toggle from 'material-ui/Toggle'
import clone from 'lodash/clone'

import Label from '../../shared/Label'
import LabelFilter from './LabelFilter'
import Strukturbaum from './Strukturbaum'
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

class StrukturbaumContainer extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  componentDidMount() {
    // console.log(`StrukturbaumContainer did mount`)
    const { store } = this.props
    // $FlowIssue
    store.ui.treeHeight = this.tree.clientHeight
    // $FlowIssue
    const treeRect = this.tree.getBoundingClientRect()
    store.ui.treeTopPosition = treeRect.top
  }

  showMapIfNotYetVisible = () => {
    const { store } = this.props
    const projekteTabs = store.urlQuery.projekteTabs ? clone(store.urlQuery.projekteTabs) : []
    const isVisible = projekteTabs.includes(`karte`)
    if (!isVisible) {
      projekteTabs.push(`karte`)
      store.setUrlQuery(`projekteTabs`, projekteTabs)
    }
  }

  handleClick = (e, data, element) => {
    const { store } = this.props
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
        store.insertDataset(table, idToPass, baseUrl)
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
      }
    }
    if (Object.keys(actions).includes(action)) {
      actions[action]()
    } else {
      store.listError(new Error(`action "${action}" unknown, therefore not executed`))
    }
  }

  render() {
    const { store } = this.props
    const { activeUrlElements, activeDataset, tree } = store
    const showApDivToggle = activeDataset

    return (
      <Container exporte={activeUrlElements.exporte}>
        <LabelFilterContainer>
          <LabelFilter />
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
          <Strukturbaum
            projektLoading={store.table.projektLoading}
            nodes={store.tree.node.nodes}
            mapTpopBeobVisible={store.map.activeApfloraLayers.includes(`TpopBeob`)}
            mapBeobNichtBeurteiltVisible={store.map.activeApfloraLayers.includes(`BeobNichtBeurteilt`)}
            mapBeobNichtZuzuordnenVisible={store.map.activeApfloraLayers.includes(`BeobNichtZuzuordnen`)}
            mapPopVisible={store.map.activeApfloraLayers.includes(`Pop`)}
            mapTpopVisible={store.map.activeApfloraLayers.includes(`Tpop`)}
            popHighlightedIdsString={store.map.pop.highlightedIds.join()}
            url={store.activeNodeArray}
          />
        </div>
        <CmApFolder onClick={this.handleClick} />
        <CmAp onClick={this.handleClick} />
        <CmApberuebersichtFolder onClick={this.handleClick} />
        <CmApberuebersicht onClick={this.handleClick} />
        <CmAssozartFolder onClick={this.handleClick} />
        <CmAssozart onClick={this.handleClick} />
        <CmTpopbeobFolder onClick={this.handleClick} />
        <CmBerFolder onClick={this.handleClick} />
        <CmBer onClick={this.handleClick} />
        <CmApberFolder onClick={this.handleClick} />
        <CmApber onClick={this.handleClick} />
        <CmErfkritFolder onClick={this.handleClick} />
        <CmErfkrit onClick={this.handleClick} />
        <CmZielFolder onClick={this.handleClick} />
        <CmZielJahrFolder onClick={this.handleClick} />
        <CmZiel onClick={this.handleClick} />
        <CmZielBerFolder onClick={this.handleClick} />
        <CmZielBer onClick={this.handleClick} />
        <CmPopFolder onClick={this.handleClick} />
        <CmPop onClick={this.handleClick} />
        <CmPopmassnberFolder onClick={this.handleClick} />
        <CmPopmassnber onClick={this.handleClick} />
        <CmPopberFolder onClick={this.handleClick} />
        <CmPopber onClick={this.handleClick} />
        <CmTpopFolder onClick={this.handleClick} />
        <CmTpop onClick={this.handleClick} />
        <CmTpopberFolder onClick={this.handleClick} />
        <CmTpopber onClick={this.handleClick} />
        <CmTpopfreiwkontrFolder onClick={this.handleClick} />
        <CmTpopfreiwkontr onClick={this.handleClick} />
        <CmTpopfreiwkontrzaehlFolder onClick={this.handleClick} />
        <CmTpopfreiwkontrzaehl onClick={this.handleClick} />
        <CmTpopfeldkontrFolder onClick={this.handleClick} />
        <CmTpopfeldkontr onClick={this.handleClick} />
        <CmTpopfeldkontrzaehlFolder onClick={this.handleClick} />
        <CmTpopfeldkontrzaehl onClick={this.handleClick} />
        <CmTpopmassnberFolder onClick={this.handleClick} />
        <CmTpopmassnber onClick={this.handleClick} />
        <CmTpopmassnFolder onClick={this.handleClick} />
        <CmTpopmassn onClick={this.handleClick} />
      </Container>
    )
  }
}

export default enhance(StrukturbaumContainer)
