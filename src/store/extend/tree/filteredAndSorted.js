// @flow
import { extendObservable, computed } from 'mobx'

import filteredAndSortedProjekt from '../../compute/filteredAndSorted/projekt'
import filteredAndSortedApberuebersicht
  from '../../compute/filteredAndSorted/apberuebersicht'
import filteredAndSortedAp from '../../compute/filteredAndSorted/ap'
import filteredAndSortedAssozart from '../../compute/filteredAndSorted/assozart'
import filteredAndSortedIdealbiotop
  from '../../compute/filteredAndSorted/idealbiotop'
import filteredAndSortedBeobNichtZuzuordnen
  from '../../compute/filteredAndSorted/beobNichtZuzuordnen'
import filteredAndSortedBeobzuordnung
  from '../../compute/filteredAndSorted/beobzuordnung'
import filteredAndSortedBer from '../../compute/filteredAndSorted/ber'
import filteredAndSortedApber from '../../compute/filteredAndSorted/apber'
import filteredAndSortedErfkrit from '../../compute/filteredAndSorted/erfkrit'
import filteredAndSortedZieljahr from '../../compute/filteredAndSorted/zieljahr'
import filteredAndSortedZiel from '../../compute/filteredAndSorted/ziel'
import filteredAndSortedZielber from '../../compute/filteredAndSorted/zielber'
import filteredAndSortedPop from '../../compute/filteredAndSorted/pop'
import filteredAndSortedPopmassnber
  from '../../compute/filteredAndSorted/popmassnber'
import filteredAndSortedPopber from '../../compute/filteredAndSorted/popber'
import filteredAndSortedTpop from '../../compute/filteredAndSorted/tpop'
import filteredAndSortedTpopbeob from '../../compute/filteredAndSorted/tpopbeob'
import filteredAndSortedTopber from '../../compute/filteredAndSorted/tpopber'
import filteredAndSortedTpopfreiwkontr
  from '../../compute/filteredAndSorted/tpopfreiwkontr'
import filteredAndSortedTpopfreiwkontrzaehl
  from '../../compute/filteredAndSorted/tpopfreiwkontrzaehl'
import filteredAndSortedTpopfeldkontr
  from '../../compute/filteredAndSorted/tpopfeldkontr'
import filteredAndSortedTpopfeldkontrzaehl
  from '../../compute/filteredAndSorted/tpopfeldkontrzaehl'
import filteredAndSortedTpopmassnber
  from '../../compute/filteredAndSorted/tpopmassnber'
import filteredAndSortedTpopmassn
  from '../../compute/filteredAndSorted/tpopmassn'

export default (store: Object, tree: Object): void => {
  extendObservable(tree.filteredAndSorted, {
    projekt: computed(() => filteredAndSortedProjekt(store, tree), {
      name: `projektFilteredAndSorted`
    }),
    apberuebersicht: computed(
      () => filteredAndSortedApberuebersicht(store, tree),
      { name: `xxxFilteredAndSorted` }
    ),
    ap: computed(() => filteredAndSortedAp(store, tree), {
      name: `apFilteredAndSorted`
    }),
    assozart: computed(() => filteredAndSortedAssozart(store, tree), {
      name: `assozartFilteredAndSorted`
    }),
    idealbiotop: computed(() => filteredAndSortedIdealbiotop(store, tree), {
      name: `idealbiotopFilteredAndSorted`
    }),
    beobNichtZuzuordnen: computed(
      () => filteredAndSortedBeobNichtZuzuordnen(store, tree),
      { name: `beobNichtZuzuordnenFilteredAndSorted` }
    ),
    beobzuordnung: computed(() => filteredAndSortedBeobzuordnung(store, tree), {
      name: `beobzuordnungFilteredAndSorted`
    }),
    ber: computed(() => filteredAndSortedBer(store, tree), {
      name: `berFilteredAndSorted`
    }),
    apber: computed(() => filteredAndSortedApber(store, tree), {
      name: `apberFilteredAndSorted`
    }),
    erfkrit: computed(() => filteredAndSortedErfkrit(store, tree), {
      name: `erfkritFilteredAndSorted`
    }),
    zieljahr: computed(() => filteredAndSortedZieljahr(store, tree), {
      name: `zieljahrFilteredAndSorted`
    }),
    ziel: computed(() => filteredAndSortedZiel(store, tree), {
      name: `zielFilteredAndSorted`
    }),
    zielber: computed(() => filteredAndSortedZielber(store, tree), {
      name: `xxxFilteredAndSorted`
    }),
    pop: computed(() => filteredAndSortedPop(store, tree), {
      name: `popFilteredAndSorted`
    }),
    popmassnber: computed(() => filteredAndSortedPopmassnber(store, tree), {
      name: `popmassnberFilteredAndSorted`
    }),
    popber: computed(() => filteredAndSortedPopber(store, tree), {
      name: `popberFilteredAndSorted`
    }),
    tpop: computed(() => filteredAndSortedTpop(store, tree), {
      name: `tpopFilteredAndSorted`
    }),
    tpopbeob: computed(() => filteredAndSortedTpopbeob(store, tree), {
      name: `tpopbeobFilteredAndSorted`
    }),
    tpopber: computed(() => filteredAndSortedTopber(store, tree), {
      name: `tpopberFilteredAndSorted`
    }),
    tpopfreiwkontr: computed(
      () => filteredAndSortedTpopfreiwkontr(store, tree),
      { name: `tpopfreiwkontrFilteredAndSorted` }
    ),
    tpopfreiwkontrzaehl: computed(
      () => filteredAndSortedTpopfreiwkontrzaehl(store, tree),
      { name: `tpopfreiwkontrzaehlFilteredAndSorted` }
    ),
    tpopfeldkontr: computed(() => filteredAndSortedTpopfeldkontr(store, tree), {
      name: `tpopfeldkontrFilteredAndSorted`
    }),
    tpopfeldkontrzaehl: computed(
      () => filteredAndSortedTpopfeldkontrzaehl(store, tree),
      { name: `tpopfeldkontrzaehlFilteredAndSorted` }
    ),
    tpopmassnber: computed(() => filteredAndSortedTpopmassnber(store, tree), {
      name: `tpopmassnberFilteredAndSorted`
    }),
    tpopmassn: computed(() => filteredAndSortedTpopmassn(store, tree), {
      name: `tpopmassnFilteredAndSorted`
    })
  })
}
