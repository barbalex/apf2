// @flow
import { Container } from 'unstated'
import cloneDeep from 'lodash/cloneDeep'

import { initial as ap } from './ap'
import { initial as pop } from './pop'
import { initial as tpop } from './tpop'

type NodeFilterState = {
  tree: {
    activeTable: string,
    ap: Object,
    pop: Object,
    tpop: Object,
    tpopkontr: Object,
    tpopfeldkontr: Object,
    tpopfreiwkontr: Object,
    tpopkontrzaehl: Object,
    tpopmassn: Object,
    ziel: Object,
    zielber: Object,
    erfkrit: Object,
    apber: Object,
    apberuebersicht: Object,
    ber: Object,
    idealbiotop: Object,
    assozart: Object,
    ekfzaehleinheit: Object,
    popber: Object,
    popmassnber: Object,
    tpopber: Object,
    tpopmassnber: Object,
    apart: Object,
    projekt: Object,
    beob: Object,
    beobprojekt: Object,
    adresse: Object,
    gemeinde: Object,
    user: Object,
  },
  tree2: {
    activeTable: string,
    ap: Object,
    pop: Object,
    tpop: Object,
    tpopkontr: Object,
    tpopfeldkontr: Object,
    tpopfreiwkontr: Object,
    tpopkontrzaehl: Object,
    tpopmassn: Object,
    ziel: Object,
    zielber: Object,
    erfkrit: Object,
    apber: Object,
    apberuebersicht: Object,
    ber: Object,
    idealbiotop: Object,
    assozart: Object,
    ekfzaehleinheit: Object,
    popber: Object,
    popmassnber: Object,
    tpopber: Object,
    tpopmassnber: Object,
    apart: Object,
    projekt: Object,
    beob: Object,
    beobprojekt: Object,
    adresse: Object,
    gemeinde: Object,
    user: Object,
  },
}

const initialTreeState = {
  activeTable: null,
  ap,
  pop,
  tpop,
  tpopkontr: {},
  tpopfeldkontr: {},
  tpopfreiwkontr: {},
  tpopkontrzaehl: {},
  tpopmassn: {},
  ziel: {},
  zielber: {},
  erfkrit: {},
  apber: {},
  apberuebersicht: {},
  ber: {},
  idealbiotop: {},
  assozart: {},
  ekfzaehleinheit: {},
  popber: {},
  popmassnber: {},
  tpopber: {},
  tpopmassnber: {},
  apart: {},
  projekt: {},
  beob: {},
  beobprojekt: {},
  adresse: {},
  gemeinde: {},
  user: {},
}

class NodeFilterContainer extends Container<NodeFilterState> {
  state = { tree: initialTreeState, tree2: initialTreeState }

  set({ treeName, nodeFilter }) {
    this.setState(state => {
      const newState = cloneDeep(state)
      newState[treeName] = nodeFilter
      return newState
    })
  }

  setValue({ treeName, table, key, value }) {
    //console.log('state, nodeFilter', { treeName, table, key, value })
    this.setState(state => {
      const newState = cloneDeep(state)
      newState[treeName][table][key] = value
      return newState
    })
  }

  emptyTree(treeName) {
    this.setState(state => {
      const newState = cloneDeep(state)
      newState[treeName] = initialTreeState
      return newState
    })
  }

  emptyTable({ treeName, table }) {
    this.setState(state => {
      const newState = cloneDeep(state)
      newState[treeName][table] = initialTreeState[table]
      return newState
    })
  }

  setActiveTable({ treeName, activeTable }) {
    this.setState(state => {
      const newState = cloneDeep(state)
      newState[treeName].activeTable = activeTable
      return newState
    })
  }

  tableIsFiltered({ treeName, table }) {
    const tableFilter = this.state[treeName][table]
    return Object.values(tableFilter).filter(v => v || v === 0).length > 0
  }

  treeIsFiltered(treeName) {
    const tables = Object.keys(this.state[treeName]).filter(
      t => t !== 'activeTable',
    )
    return tables.some(table => this.tableIsFiltered({ treeName, table }))
  }
}

export default NodeFilterContainer
