// @flow
import { types } from 'mobx-state-tree'

export const type = types.model({
  typ: types.optional(types.maybeNull(types.number), null),
  beschreibung: types.optional(types.maybeNull(types.string), null),
  jahr: types.optional(types.maybeNull(types.number), null),
  datum: types.optional(types.maybeNull(types.string), null),
  bearbeiter: types.optional(types.maybeNull(types.string), null),
  bemerkungen: types.optional(types.maybeNull(types.string), null),
  planVorhanden: types.optional(types.maybeNull(types.number), null),
  planBezeichnung: types.optional(types.maybeNull(types.string), null),
  flaeche: types.optional(types.maybeNull(types.number), null),
  markierung: types.optional(types.maybeNull(types.string), null),
  anzTriebe: types.optional(types.maybeNull(types.number), null),
  anzPflanzen: types.optional(types.maybeNull(types.number), null),
  anzPflanzstellen: types.optional(types.maybeNull(types.number), null),
  wirtspflanze: types.optional(types.maybeNull(types.string), null),
  herkunftPop: types.optional(types.maybeNull(types.string), null),
  sammeldatum: types.optional(types.maybeNull(types.string), null),
  form: types.optional(types.maybeNull(types.string), null),
  pflanzanordnung: types.optional(types.maybeNull(types.string), null),
})

export const initial = {
  typ: null,
  beschreibung: null,
  jahr: null,
  datum: null,
  bearbeiter: null,
  bemerkungen: null,
  planVorhanden: null,
  planBezeichnung: null,
  flaeche: null,
  markierung: null,
  anzTriebe: null,
  anzPflanzen: null,
  anzPflanzstellen: null,
  wirtspflanze: null,
  herkunftPop: null,
  sammeldatum: null,
  form: null,
  pflanzanordnung: null,
}
