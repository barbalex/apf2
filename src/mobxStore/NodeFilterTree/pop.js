// @flow
import { types } from 'mobx-state-tree'

export const type = types.model({
  nr: types.optional(types.maybeNull(types.number), null),
  name: types.optional(types.maybeNull(types.string), null),
  status: types.optional(types.maybeNull(types.number), null),
  statusUnklar: types.optional(types.maybeNull(types.boolean), null),
  statusUnklarBegruendung: types.optional(types.maybeNull(types.string), null),
  bekanntSeit: types.optional(types.maybeNull(types.number), null),
  x: types.optional(types.maybeNull(types.number), null),
  y: types.optional(types.maybeNull(types.number), null),
})

export const initial = {
  nr: null,
  name: null,
  status: null,
  statusUnklar: null,
  statusUnklarBegruendung: null,
  bekanntSeit: null,
  x: null,
  y: null,
}
