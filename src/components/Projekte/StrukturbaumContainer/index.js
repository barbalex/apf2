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

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 500px;
  border-color: #424242;
  border-width: 1px;
  border-style: solid;
`
const ContainerExporte = styled(StyledContainer)`
  flex-basis: 200px;
  flex-grow: 0;
  flex-shrink: 0;
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

const enhance = compose(
  inject(`store`),
  observer
)

class StrukturbaumContainer extends Component { // eslint-disable-line react/prefer-stateless-function

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.showMapIfNotYetVisible = this.showMapIfNotYetVisible.bind(this)
  }

  componentDidMount() {
    const { store } = this.props
    store.ui.treeHeight = this.tree.clientHeight
    const treeRect = this.tree.getBoundingClientRect()
    store.ui.treeTopPosition = treeRect.top
  }

  showMapIfNotYetVisible() {
    const { store } = this.props
    const projekteTabs = store.urlQuery.projekteTabs ? clone(store.urlQuery.projekteTabs) : []
    const isVisible = projekteTabs.includes(`karte`)
    if (!isVisible) {
      projekteTabs.push(`karte`)
      store.setUrlQuery(`projekteTabs`, projekteTabs)
    }
  }

  handleClick(e, data, element) {
    const { store } = this.props
    const { table, action, idTable, actionTable } = data
    const id = element.firstElementChild.getAttribute(`data-id`)
    const parentId = element.firstElementChild.getAttribute(`data-parentId`)
    const url = element.firstElementChild.getAttribute(`data-url`)
    const label = element.firstElementChild.getAttribute(`data-label`)
    const baseUrl = JSON.parse(url)
    const nodeType = element.firstElementChild.getAttribute(`data-nodeType`)
    const menuType = element.firstElementChild.getAttribute(`data-menuType`)
    if (action === `insert`) {
      if (nodeType === `table`) {
        baseUrl.pop()
      }
      if (menuType === `zielFolder`) {
        // db sets year 1 as standard
        baseUrl.push(1)
      }
      const idToPass = parentId || id
      store.insertDataset(table, idToPass, baseUrl)
    } else if (action === `delete`) {
      store.deleteDatasetDemand(table, id, baseUrl, label)
    } else if (action === `showOnMap`) {
      // actionTable: table to show on map
      // idTable: table from which to filter datasets of actionTable
      console.log(`action:`, action)  // eslint-disable-line no-console
      console.log(`idTable:`, idTable)  // eslint-disable-line no-console
      console.log(`actionTable:`, actionTable)  // eslint-disable-line no-console
      console.log(`id:`, id)  // eslint-disable-line no-console
      console.log(`parentId:`, parentId)  // eslint-disable-line no-console
      // 0. load missing data if necessary
      if (actionTable === `tpop`) {
        console.log(`fetching tpop for ap:`, store.activeUrlElements.ap)
        store.fetchTpopForAp(store.activeUrlElements.ap)
      }
      // 1. open map if not yet open
      this.showMapIfNotYetVisible()
      // 2 add layer for actionTable
      store.showMapLayer(actionTable, !store.map.layer[actionTable].visible)
    } else if (action === `highlightOnMap`) {
      this.showMapIfNotYetVisible()
      store.showMapLayer(actionTable, true)
      if (store.map.layer[actionTable].highlightedIds.includes(id)) {
        store.unhighlightIdOnMap(actionTable, parseInt(id, 10))
      } else {
        store.highlightIdOnMap(actionTable, parseInt(id, 10))
      }
    }
  }

  render() {
    const { store } = this.props
    const { activeUrlElements, activeDataset, node, toggleApFilter } = store
    const Container = activeUrlElements.exporte ? ContainerExporte : StyledContainer
    const showApDivToggle = (
      activeDataset &&
      activeDataset.table &&
      (
        activeDataset.table === `projekt` ||
        activeDataset.table === `ap`
      )
    )

    return (
      <Container>
        <LabelFilterContainer>
          <LabelFilter />
          {
            showApDivToggle &&
            <NurApDiv>
              <Label
                label="nur AP"
              />
              <ApDivToggle
                toggled={node.apFilter}
                thumbStyle={{ backgroundColor: `rgb(245, 245, 245)` }}
                onToggle={() => toggleApFilter()}
              />
            </NurApDiv>
          }
        </LabelFilterContainer>
        <div
          style={{
            flexGrow: 1,
            flexBasis: `100%`,
          }}
          ref={(c) => { this.tree = c }}
        >
          <Strukturbaum />
        </div>
        <CmApFolder onClick={this.handleClick} />
        <CmAp onClick={this.handleClick} />
        <CmApberuebersichtFolder onClick={this.handleClick} />
        <CmApberuebersicht onClick={this.handleClick} />
        <CmAssozartFolder onClick={this.handleClick} />
        <CmAssozart onClick={this.handleClick} />
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
