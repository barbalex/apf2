// @flow
import { Container } from 'unstated'
import { initial as ap } from './ap'

type NodeFilterState = {
  show: Boolean,
  tree: {
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
  ap,
  pop: null,
  tpop: null,
  tpopkontr: null,
  tpopfeldkontr: null,
  tpopfreiwkontr: null,
  tpopkontrzaehl: null,
  tpopmassn: null,
  ziel: null,
  zielber: null,
  erfkrit: null,
  apber: null,
  apberuebersicht: null,
  ber: null,
  idealbiotop: null,
  assozart: null,
  ekfzaehleinheit: null,
  popber: null,
  popmassnber: null,
  tpopber: null,
  tpopmassnber: null,
  apart: null,
  projekt: null,
  beob: null,
  beobprojekt: null,
  adresse: null,
  gemeinde: null,
  user: null,
}

class NodeFilterContainer extends Container<NodeFilterState> {
  state = { tree: initialTreeState, tree2: initialTreeState, show: false }

  set({ treeName, nodeFilter }) {
    this.setState(state => ({ ...state, ...{ [treeName]: nodeFilter } }))
  }

  setValue({ treeName, table, key, value }) {
    console.log('nodeFilter, setting value:', { treeName, table, key, value })
    this.setState(state => ({
      ...state,
      ...{
        [treeName]: {
          ...state[treeName],
          ...{ [table]: { ...state[table], ...{ [key]: value } } },
        },
      },
    }))
  }

  empty(treeName) {
    this.setState(state => ({ ...state, ...{ [treeName]: initialTreeState } }))
  }

  toggleShow() {
    this.setState(state => ({ ...state, ...{ show: !state.show } }))
  }
}

export default NodeFilterContainer
