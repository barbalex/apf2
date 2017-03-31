// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import filteredAndSortedProjekt from './table/filteredAndSorted/projekt'
import filteredAndSortedApberuebersicht from './table/filteredAndSorted/apberuebersicht'
import filteredAndSortedAp from './table/filteredAndSorted/ap'
import filteredAndSortedAssozart from './table/filteredAndSorted/assozart'
import filteredAndSortedIdealbiotop from './table/filteredAndSorted/idealbiotop'
import filteredAndSortedBeobNichtZuzuordnen from './table/filteredAndSorted/beobNichtZuzuordnen'
import filteredAndSortedBeobzuordnung from './table/filteredAndSorted/beobzuordnung'
import filteredAndSortedBer from './table/filteredAndSorted/ber'
import filteredAndSortedApber from './table/filteredAndSorted/apber'
import filteredAndSortedErfkrit from './table/filteredAndSorted/erfkrit'
import filteredAndSortedZieljahr from './table/filteredAndSorted/zieljahr'
import filteredAndSortedZiel from './table/filteredAndSorted/ziel'
import filteredAndSortedZielber from './table/filteredAndSorted/zielber'
import filteredAndSortedPop from './table/filteredAndSorted/pop'
import filteredAndSortedPopmassnber from './table/filteredAndSorted/popmassnber'
import filteredAndSortedPopber from './table/filteredAndSorted/popber'
import filteredAndSortedTpop from './table/filteredAndSorted/tpop'
import filteredAndSortedTpopbeob from './table/filteredAndSorted/tpopbeob'
import filteredAndSortedTopber from './table/filteredAndSorted/tpopber'
import filteredAndSortedTpopfreiwkontr from './table/filteredAndSorted/tpopfreiwkontr'
import filteredAndSortedTpopfreiwkontrzaehl from './table/filteredAndSorted/tpopfreiwkontrzaehl'
import filteredAndSortedTpopfeldkontr from './table/filteredAndSorted/tpopfeldkontr'
import filteredAndSortedTpopfeldkontrzaehl from './table/filteredAndSorted/tpopfeldkontrzaehl'
import filteredAndSortedTpopmassnber from './table/filteredAndSorted/tpopmassnber'
import filteredAndSortedTpopmassn from './table/filteredAndSorted/tpopmassn'

export default (store:Object) => {
  extendObservable(store.table.filteredAndSorted, {
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
