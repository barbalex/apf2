// @flow
import { extendObservable, computed } from 'mobx'

import filteredAndSortedProjekt from '../../compute/filteredAndSorted/projekt'
import filteredAndSortedApberuebersicht from '../../compute/filteredAndSorted/apberuebersicht'
import filteredAndSortedAp from '../../compute/filteredAndSorted/ap'
import filteredAndSortedAssozart from '../../compute/filteredAndSorted/assozart'
import filteredAndSortedBeobArt from '../../compute/filteredAndSorted/beobart'
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

export default (store: Object, tree: Object): void => {
  extendObservable(tree.filteredAndSorted, {
    projekt: computed(() => filteredAndSortedProjekt(store, tree), {
      name: 'projektFilteredAndSorted',
    }),
    apberuebersicht: computed(() =>
      filteredAndSortedApberuebersicht(store, tree)
    ),
    ap: computed(() => filteredAndSortedAp(store, tree)),
    assozart: computed(() => filteredAndSortedAssozart(store, tree)),
    beobart: computed(() => filteredAndSortedBeobArt(store, tree)),
    idealbiotop: computed(() => filteredAndSortedIdealbiotop(store, tree)),
    beobNichtZuzuordnen: computed(() =>
      filteredAndSortedBeobNichtZuzuordnen(store, tree)
    ),
    beobzuordnung: computed(() => filteredAndSortedBeobzuordnung(store, tree)),
    ber: computed(() => filteredAndSortedBer(store, tree)),
    apber: computed(() => filteredAndSortedApber(store, tree)),
    erfkrit: computed(() => filteredAndSortedErfkrit(store, tree)),
    zieljahr: computed(() => filteredAndSortedZieljahr(store, tree)),
    ziel: computed(() => filteredAndSortedZiel(store, tree)),
    zielber: computed(() => filteredAndSortedZielber(store, tree)),
    pop: computed(() => filteredAndSortedPop(store, tree)),
    popmassnber: computed(() => filteredAndSortedPopmassnber(store, tree)),
    popber: computed(() => filteredAndSortedPopber(store, tree)),
    tpop: computed(() => filteredAndSortedTpop(store, tree)),
    tpopbeob: computed(() => filteredAndSortedTpopbeob(store, tree)),
    tpopber: computed(() => filteredAndSortedTopber(store, tree)),
    tpopfreiwkontr: computed(() =>
      filteredAndSortedTpopfreiwkontr(store, tree)
    ),
    tpopfreiwkontrzaehl: computed(() =>
      filteredAndSortedTpopfreiwkontrzaehl(store, tree)
    ),
    tpopfeldkontr: computed(() => filteredAndSortedTpopfeldkontr(store, tree)),
    tpopfeldkontrzaehl: computed(() =>
      filteredAndSortedTpopfeldkontrzaehl(store, tree)
    ),
    tpopmassnber: computed(() => filteredAndSortedTpopmassnber(store, tree)),
    tpopmassn: computed(() => filteredAndSortedTpopmassn(store, tree)),
  })
}
