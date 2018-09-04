// @flow
import { Container } from 'unstated'
import { apType, initialAp } from './ap'

type NodeFilterState = {
  ap: apType,
}

const initialState = {
  ap: initialAp,
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
  state = initialState
  set(nodeFilter) {
    this.setState(() => nodeFilter)
  }
  setValue({ table, key, value }) {
    this.setState(state => ({
      ...state,
      ...{ [table]: { ...state[table], ...{ [key]: value } } },
    }))
  }
  empty() {
    this.setState(state => initialState)
  }
}

export default NodeFilterContainer
