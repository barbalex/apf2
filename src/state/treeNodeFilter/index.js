// @flow
import { Container } from 'unstated'
import Ap, { apType } from './ap'

type NodeFilterState = {
  ap: apType,
}

class NodeFilterContainer extends Container<NodeFilterState> {
  state = {
    ap: new Ap(),
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
  set(nodeFilter) {
    Object.keys(nodeFilter).forEach(key => this.state[key].set(nodeFilter[key]))
  }
  setValue({ table, key, value }) {
    this.state[table].setValue({ key, value })
  }
  empty() {
    Object.keys(this.state).forEach(key => this.state[key].empty())
  }
}

export default NodeFilterContainer
