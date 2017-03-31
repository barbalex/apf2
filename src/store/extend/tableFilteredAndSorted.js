// @flow
import {
  extendObservable,
  computed,
} from 'mobx'

import filteredAndSortedProjekt from '../Table/filteredAndSorted/projekt'
import filteredAndSortedApberuebersicht from '../Table/filteredAndSorted/apberuebersicht'
import filteredAndSortedAp from '../Table/filteredAndSorted/ap'
import filteredAndSortedAssozart from '../Table/filteredAndSorted/assozart'
import filteredAndSortedIdealbiotop from '../Table/filteredAndSorted/idealbiotop'
import filteredAndSortedBeobNichtZuzuordnen from '../Table/filteredAndSorted/beobNichtZuzuordnen'
import filteredAndSortedBeobzuordnung from '../Table/filteredAndSorted/beobzuordnung'
import filteredAndSortedBer from '../Table/filteredAndSorted/ber'
import filteredAndSortedApber from '../Table/filteredAndSorted/apber'
import filteredAndSortedErfkrit from '../Table/filteredAndSorted/erfkrit'
import filteredAndSortedZieljahr from '../Table/filteredAndSorted/zieljahr'
import filteredAndSortedZiel from '../Table/filteredAndSorted/ziel'
import filteredAndSortedZielber from '../Table/filteredAndSorted/zielber'
import filteredAndSortedPop from '../Table/filteredAndSorted/pop'
import filteredAndSortedPopmassnber from '../Table/filteredAndSorted/popmassnber'
import filteredAndSortedPopber from '../Table/filteredAndSorted/popber'
import filteredAndSortedTpop from '../Table/filteredAndSorted/tpop'
import filteredAndSortedTpopbeob from '../Table/filteredAndSorted/tpopbeob'
import filteredAndSortedTopber from '../Table/filteredAndSorted/tpopber'
import filteredAndSortedTpopfreiwkontr from '../Table/filteredAndSorted/tpopfreiwkontr'
import filteredAndSortedTpopfreiwkontrzaehl from '../Table/filteredAndSorted/tpopfreiwkontrzaehl'
import filteredAndSortedTpopfeldkontr from '../Table/filteredAndSorted/tpopfeldkontr'
import filteredAndSortedTpopfeldkontrzaehl from '../Table/filteredAndSorted/tpopfeldkontrzaehl'
import filteredAndSortedTpopmassnber from '../Table/filteredAndSorted/tpopmassnber'
import filteredAndSortedTpopmassn from '../Table/filteredAndSorted/tpopmassn'

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
