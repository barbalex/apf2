// @flow
import { types } from 'mobx-state-tree'

export const type = types.model({
  artId: types.optional(types.maybeNull(types.string), null),
  bearbeitung: types.optional(types.maybeNull(types.number), null),
  startJahr: types.optional(types.maybeNull(types.number), null),
  umsetzung: types.optional(types.maybeNull(types.number), null),
  bearbeiter: types.optional(types.maybeNull(types.number), null),
  ekfBeobachtungszeitpunkt: types.optional(types.maybeNull(types.string), null),
})

export const initial = {
  artId: null,
  bearbeitung: null,
  startJahr: null,
  umsetzung: null,
  bearbeiter: null,
  ekfBeobachtungszeitpunkt: null,
}
