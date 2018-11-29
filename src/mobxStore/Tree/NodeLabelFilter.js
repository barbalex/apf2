import { types } from 'mobx-state-tree'

export default types
  .model('NodeLabelFilter', {
    ap: types.optional(types.maybeNull(types.string), null),
    pop: types.optional(types.maybeNull(types.string), null),
    tpop: types.optional(types.maybeNull(types.string), null),
    tpopkontr: types.optional(types.maybeNull(types.string), null),
    tpopfeldkontr: types.optional(types.maybeNull(types.string), null),
    tpopfreiwkontr: types.optional(types.maybeNull(types.string), null),
    tpopkontrzaehl: types.optional(types.maybeNull(types.string), null),
    tpopmassn: types.optional(types.maybeNull(types.string), null),
    ziel: types.optional(types.maybeNull(types.string), null),
    zielber: types.optional(types.maybeNull(types.string), null),
    erfkrit: types.optional(types.maybeNull(types.string), null),
    apber: types.optional(types.maybeNull(types.string), null),
    apberuebersicht: types.optional(types.maybeNull(types.string), null),
    ber: types.optional(types.maybeNull(types.string), null),
    idealbiotop: types.optional(types.maybeNull(types.string), null),
    assozart: types.optional(types.maybeNull(types.string), null),
    ekfzaehleinheit: types.optional(types.maybeNull(types.string), null),
    popber: types.optional(types.maybeNull(types.string), null),
    popmassnber: types.optional(types.maybeNull(types.string), null),
    tpopber: types.optional(types.maybeNull(types.string), null),
    tpopmassnber: types.optional(types.maybeNull(types.string), null),
    apart: types.optional(types.maybeNull(types.string), null),
    projekt: types.optional(types.maybeNull(types.string), null),
    beob: types.optional(types.maybeNull(types.string), null),
    beobprojekt: types.optional(types.maybeNull(types.string), null),
    adresse: types.optional(types.maybeNull(types.string), null),
    gemeinde: types.optional(types.maybeNull(types.string), null),
    user: types.optional(types.maybeNull(types.string), null),
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
