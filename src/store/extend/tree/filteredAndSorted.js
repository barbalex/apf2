// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import filteredAndSortedProjekt from '../../compute/filteredAndSorted/projekt'
import filteredAndSortedApberuebersicht from '../../compute/filteredAndSorted/apberuebersicht'
import filteredAndSortedAp from '../../compute/filteredAndSorted/ap'
import filteredAndSortedAssozart from '../../compute/filteredAndSorted/assozart'
import filteredAndSortedIdealbiotop from '../../compute/filteredAndSorted/idealbiotop'
import filteredAndSortedBeobNichtZuzuordnen from '../../compute/filteredAndSorted/beobNichtZuzuordnen'
import filteredAndSortedBeobzuordnung from '../../compute/filteredAndSorted/beobzuordnung'
import filteredAndSortedBer from '../../compute/filteredAndSorted/ber'
import filteredAndSortedApber from '../../compute/filteredAndSorted/apber'
import filteredAndSortedErfkrit from '../../compute/filteredAndSorted/erfkrit'
import filteredAndSortedZieljahr from '../../compute/filteredAndSorted/zieljahr'
import filteredAndSortedZiel from '../../compute/filteredAndSorted/ziel'
import filteredAndSortedZielber from '../../compute/filteredAndSorted/zielber'
import filteredAndSortedPop from '../../compute/filteredAndSorted/pop'
import filteredAndSortedPopmassnber from '../../compute/filteredAndSorted/popmassnber'
import filteredAndSortedPopber from '../../compute/filteredAndSorted/popber'
import filteredAndSortedTpop from '../../compute/filteredAndSorted/tpop'
import filteredAndSortedTpopbeob from '../../compute/filteredAndSorted/tpopbeob'
import filteredAndSortedTopber from '../../compute/filteredAndSorted/tpopber'
import filteredAndSortedTpopfreiwkontr from '../../compute/filteredAndSorted/tpopfreiwkontr'
import filteredAndSortedTpopfreiwkontrzaehl from '../../compute/filteredAndSorted/tpopfreiwkontrzaehl'
import filteredAndSortedTpopfeldkontr from '../../compute/filteredAndSorted/tpopfeldkontr'
import filteredAndSortedTpopfeldkontrzaehl from '../../compute/filteredAndSorted/tpopfeldkontrzaehl'
import filteredAndSortedTpopmassnber from '../../compute/filteredAndSorted/tpopmassnber'
import filteredAndSortedTpopmassn from '../../compute/filteredAndSorted/tpopmassn'

export default (store: Object) => {
  extendObservable(store.tree.filteredAndSorted, {
    projekt: computed(
      () => filteredAndSortedProjekt(store, store.tree),
      { name: `projektFilteredAndSorted` }
    ),
    apberuebersicht: computed(
      () => filteredAndSortedApberuebersicht(store, store.tree),
      { name: `xxxFilteredAndSorted` }
    ),
    ap: computed(
      () => filteredAndSortedAp(store, store.tree),
      { name: `apFilteredAndSorted` }
    ),
    assozart: computed(
      () => filteredAndSortedAssozart(store, store.tree),
      { name: `assozartFilteredAndSorted` }
    ),
    idealbiotop: computed(
      () => filteredAndSortedIdealbiotop(store, store.tree),
      { name: `idealbiotopFilteredAndSorted` }
    ),
    beobNichtZuzuordnen: computed(
      () => filteredAndSortedBeobNichtZuzuordnen(store, store.tree),
      { name: `beobNichtZuzuordnenFilteredAndSorted` }
    ),
    beobzuordnung: computed(
      () => filteredAndSortedBeobzuordnung(store, store.tree),
      { name: `beobzuordnungFilteredAndSorted` }
    ),
    ber: computed(
      () => filteredAndSortedBer(store, store.tree),
      { name: `berFilteredAndSorted` }
    ),
    apber: computed(
      () => filteredAndSortedApber(store, store.tree),
      { name: `apberFilteredAndSorted` }
    ),
    erfkrit: computed(
      () => filteredAndSortedErfkrit(store, store.tree),
      { name: `erfkritFilteredAndSorted` }
    ),
    zieljahr: computed(
      () => filteredAndSortedZieljahr(store, store.tree),
      { name: `zieljahrFilteredAndSorted` }
    ),
    ziel: computed(
      () => filteredAndSortedZiel(store, store.tree),
      { name: `zielFilteredAndSorted` }
    ),
    zielber: computed(
      () => filteredAndSortedZielber(store, store.tree),
      { name: `xxxFilteredAndSorted` }
    ),
    pop: computed(
      () => filteredAndSortedPop(store, store.tree),
      { name: `popFilteredAndSorted` }
    ),
    popmassnber: computed(
      () => filteredAndSortedPopmassnber(store, store.tree),
      { name: `popmassnberFilteredAndSorted` }
    ),
    popber: computed(
      () => filteredAndSortedPopber(store, store.tree),
      { name: `popberFilteredAndSorted` }
    ),
    tpop: computed(
      () => filteredAndSortedTpop(store, store.tree),
      { name: `tpopFilteredAndSorted` }
    ),
    tpopbeob: computed(
      () => filteredAndSortedTpopbeob(store, store.tree),
      { name: `tpopbeobFilteredAndSorted` }
    ),
    tpopber: computed(
      () => filteredAndSortedTopber(store, store.tree),
      { name: `tpopberFilteredAndSorted` }
    ),
    tpopfreiwkontr: computed(
      () => filteredAndSortedTpopfreiwkontr(store, store.tree),
      { name: `tpopfreiwkontrFilteredAndSorted` }
    ),
    tpopfreiwkontrzaehl: computed(
      () => filteredAndSortedTpopfreiwkontrzaehl(store, store.tree),
      { name: `tpopfreiwkontrzaehlFilteredAndSorted` }
    ),
    tpopfeldkontr: computed(
      () => filteredAndSortedTpopfeldkontr(store, store.tree),
      { name: `tpopfeldkontrFilteredAndSorted` }
    ),
    tpopfeldkontrzaehl: computed(
      () => filteredAndSortedTpopfeldkontrzaehl(store, store.tree),
      { name: `tpopfeldkontrzaehlFilteredAndSorted` }
    ),
    tpopmassnber: computed(
      () => filteredAndSortedTpopmassnber(store, store.tree),
      { name: `tpopmassnberFilteredAndSorted` }
    ),
    tpopmassn: computed(
      () => filteredAndSortedTpopmassn(store, store.tree),
      { name: `tpopmassnFilteredAndSorted` }
    ),
  })
}
