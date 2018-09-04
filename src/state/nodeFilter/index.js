// @flow
import { Container } from 'unstated'
import { initial as ap } from './ap'

type NodeFilterState = {
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
}

const initialState = {
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
  state = { tree: initialState, tree2: initialState }
  set({ treeName, nodeFilter }) {
    this.setState(state => ({ ...state, ...{ [treeName]: nodeFilter } }))
  }
  setValue({ treeName, table, key, value }) {
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
    this.setState(state => ({ ...state, ...{ [treeName]: initialState } }))
  }
}

export default NodeFilterContainer
