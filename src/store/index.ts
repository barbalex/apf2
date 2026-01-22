import { types } from 'mobx-state-tree'

import { Tree, defaultValue as defaultTree } from './Tree/index.ts'
import { tableIsFiltered } from '../modules/tableIsFiltered.ts'

export const MobxStore = types
  .model({
    tree: types.optional(Tree, defaultTree),
  })
  .actions((self) => ({
    // TODO: move to modules where possible
    dataFilterTreeIsFiltered() {
      const tables = Object.keys(self.tree.dataFilter)
      return tables.some((table) =>
        tableIsFiltered({ table, tree: self.tree }),
      )
    },
    treeNodeLabelFilterResetExceptAp() {
      self.tree.nodeLabelFilter = {
        ap: self.tree.nodeLabelFilter.ap,
        pop: null,
        tpop: null,
        tpopkontr: null,
        tpopfeldkontr: null,
        tpopfreiwkontr: null,
        tpopkontrzaehl: null,
        tpopmassn: null,
        ziel: null,
        erfkrit: null,
        apber: null,
        apberuebersicht: null,
        idealbiotop: null,
        assozart: null,
        ekzaehleinheit: null,
        ekfrequenz: null,
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
    },
  }))
