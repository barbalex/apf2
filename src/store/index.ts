import { types } from 'mobx-state-tree'

import { Map, defaultValue as defaultMap } from './Map.ts'
import { Tree, defaultValue as defaultTree } from './Tree/index.ts'

export const MobxStore = types
  .model({
    activeOverlays: types.array(types.string),
    activeBaseLayer: types.optional(types.maybeNull(types.string), 'OsmColor'),
    tree: types.optional(Tree, defaultTree),
    map: types.optional(Map, defaultMap),
  })
  .actions((self) => ({
    setActiveOverlays(val) {
      self.activeOverlays = val
    },
    setActiveBaseLayer(val) {
      self.activeBaseLayer = val
    },
    tableIsFiltered(table) {
      // check nodeLabelFilter
      const nodeLabelFilterExists = !!self.tree.nodeLabelFilter[table]
      if (nodeLabelFilterExists) return true
      // check mapFilter in tables with (parent) coordinates
      if (
        [
          'pop',
          'tpop',
          'tpopfeldkontr',
          'tpopfreiwkontr',
          'tpopmassn',
        ].includes(table) &&
        self.tree.mapFilter
      ) {
        return true
      }
      // check data and hierarchy filter: is included in gqlFilter
      // check gql filter
      const gqlFilter =
        self.tree?.[`${table}GqlFilter`]?.filtered?.or?.[0] ?? {}
      const isGqlFilter = Object.keys(gqlFilter).length > 0
      return isGqlFilter
    },
    dataFilterTreeIsFiltered() {
      const tables = Object.keys(self.tree.dataFilter)
      return tables.some((table) => self.tableIsFiltered(table))
    },
    openTree2WithActiveNodeArray({
      activeNodeArray,
      search,
      projekteTabs,
      setProjekteTabs,
      onlyShowActivePath,
    }) {
      self.tree.setTree2SrcByActiveNodeArray({
        activeNodeArray,
        search,
        onlyShowActivePath,
      })
      setProjekteTabs([...projekteTabs, 'tree2', 'daten2'])
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
