// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import filteredAndSortedProjekt from './projekt'
import filteredAndSortedApberuebersicht from './apberuebersicht'
import filteredAndSortedAp from './ap'
import filteredAndSortedAssozart from './assozart'
import filteredAndSortedIdealbiotop from './idealbiotop'
import filteredAndSortedBeobNichtZuzuordnen from './beobNichtZuzuordnen'
import filteredAndSortedBeobzuordnung from './beobzuordnung'
import filteredAndSortedBer from './ber'
import filteredAndSortedApber from './apber'
import filteredAndSortedErfkrit from './erfkrit'
import filteredAndSortedZieljahr from './zieljahr'
import filteredAndSortedZiel from './ziel'
import filteredAndSortedZielber from './zielber'
import filteredAndSortedPop from './pop'
import filteredAndSortedPopmassnber from './popmassnber'
import filteredAndSortedPopber from './popber'
import filteredAndSortedTpop from './tpop'
import filteredAndSortedTpopbeob from './tpopbeob'
import filteredAndSortedTopber from './tpopber'
import filteredAndSortedTpopfreiwkontr from './tpopfreiwkontr'
import filteredAndSortedTpopfreiwkontrzaehl from './tpopfreiwkontrzaehl'
import filteredAndSortedTpopfeldkontr from './tpopfeldkontr'
import filteredAndSortedTpopfeldkontrzaehl from './tpopfeldkontrzaehl'
import filteredAndSortedTpopmassnber from './tpopmassnber'
import filteredAndSortedTpopmassn from './tpopmassn'

export default (store:Object) => {
  extendObservable(store.tree.filteredAndSorted, {
    projekt: computed(
      () => filteredAndSortedProjekt(store),
      { name: `projektFilteredAndSorted` }
    ),
    apberuebersicht: computed(
      () => filteredAndSortedApberuebersicht(store),
      { name: `xxxFilteredAndSorted` }
    ),
    ap: computed(
      () => filteredAndSortedAp(store),
      { name: `apFilteredAndSorted` }
    ),
    assozart: computed(
      () => filteredAndSortedAssozart(store),
      { name: `assozartFilteredAndSorted` }
    ),
    idealbiotop: computed(
      () => filteredAndSortedIdealbiotop(store),
      { name: `idealbiotopFilteredAndSorted` }
    ),
    beobNichtZuzuordnen: computed(
      () => filteredAndSortedBeobNichtZuzuordnen(store),
      { name: `beobNichtZuzuordnenFilteredAndSorted` }
    ),
    beobzuordnung: computed(
      () => filteredAndSortedBeobzuordnung(store),
      { name: `beobzuordnungFilteredAndSorted` }
    ),
    ber: computed(
      () => filteredAndSortedBer(store),
      { name: `berFilteredAndSorted` }
    ),
    apber: computed(
      () => filteredAndSortedApber(store),
      { name: `apberFilteredAndSorted` }
    ),
    erfkrit: computed(
      () => filteredAndSortedErfkrit(store),
      { name: `erfkritFilteredAndSorted` }
    ),
    zieljahr: computed(
      () => filteredAndSortedZieljahr(store),
      { name: `zieljahrFilteredAndSorted` }
    ),
    ziel: computed(
      () => filteredAndSortedZiel(store),
      { name: `zielFilteredAndSorted` }
    ),
    zielber: computed(
      () => filteredAndSortedZielber(store),
      { name: `xxxFilteredAndSorted` }
    ),
    pop: computed(
      () => filteredAndSortedPop(store),
      { name: `popFilteredAndSorted` }
    ),
    popmassnber: computed(
      () => filteredAndSortedPopmassnber(store),
      { name: `popmassnberFilteredAndSorted` }
    ),
    popber: computed(
      () => filteredAndSortedPopber(store),
      { name: `popberFilteredAndSorted` }
    ),
    tpop: computed(
      () => filteredAndSortedTpop(store),
      { name: `tpopFilteredAndSorted` }
    ),
    tpopbeob: computed(
      () => filteredAndSortedTpopbeob(store),
      { name: `tpopbeobFilteredAndSorted` }
    ),
    tpopber: computed(
      () => filteredAndSortedTopber(store),
      { name: `tpopberFilteredAndSorted` }
    ),
    tpopfreiwkontr: computed(
      () => filteredAndSortedTpopfreiwkontr(store),
      { name: `tpopfreiwkontrFilteredAndSorted` }
    ),
    tpopfreiwkontrzaehl: computed(
      () => filteredAndSortedTpopfreiwkontrzaehl(store),
      { name: `tpopfreiwkontrzaehlFilteredAndSorted` }
    ),
    tpopfeldkontr: computed(
      () => filteredAndSortedTpopfeldkontr(store),
      { name: `tpopfeldkontrFilteredAndSorted` }
    ),
    tpopfeldkontrzaehl: computed(
      () => filteredAndSortedTpopfeldkontrzaehl(store),
      { name: `tpopfeldkontrzaehlFilteredAndSorted` }
    ),
    tpopmassnber: computed(
      () => filteredAndSortedTpopmassnber(store),
      { name: `tpopmassnberFilteredAndSorted` }
    ),
    tpopmassn: computed(
      () => filteredAndSortedTpopmassn(store),
      { name: `tpopmassnFilteredAndSorted` }
    ),
  })
}
