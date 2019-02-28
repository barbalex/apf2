import { types } from 'mobx-state-tree'

export default types
  .model('NodeLabelFilter', {
    ap: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    pop: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    tpop: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    tpopkontr: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    tpopfeldkontr: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    tpopfreiwkontr: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    tpopkontrzaehl: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    tpopmassn: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    ziel: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    zielber: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    erfkrit: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    apber: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    apberuebersicht: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    ber: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    idealbiotop: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    assozart: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    ekfzaehleinheit: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    popber: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    popmassnber: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    tpopber: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    tpopmassnber: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    apart: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    projekt: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    beob: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    beobprojekt: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    adresse: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    gemeinde: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
    user: types.optional(
      types.maybeNull(types.union(types.string, types.number)),
      null,
    ),
  })
  .actions(self => ({
    setKey({ key, value }) {
      const oldValue = self[key]
      // only write if changed
      if (oldValue !== value) {
        self[key] = value
      }
    },
  }))

export const defaultValue = {
  ap: null,
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
