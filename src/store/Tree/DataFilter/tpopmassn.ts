import { types } from 'mobx-state-tree'

export const type = types.model({
  typ: types.optional(types.maybeNull(types.number), null),
  beschreibung: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  jahr: types.optional(types.maybeNull(types.number), null),
  datum: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  bearbeiter: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  bemerkungen: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  planVorhanden: types.optional(types.maybeNull(types.boolean), null),
  planBezeichnung: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  flaeche: types.optional(types.maybeNull(types.number), null),
  markierung: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  anzTriebe: types.optional(types.maybeNull(types.number), null),
  anzPflanzen: types.optional(types.maybeNull(types.number), null),
  anzPflanzstellen: types.optional(types.maybeNull(types.number), null),
  zieleinheitEinheit: types.optional(types.maybeNull(types.number), null),
  zieleinheitAnzahl: types.optional(types.maybeNull(types.number), null),
  wirtspflanze: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  herkunftPop: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  sammeldatum: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  vonAnzahlIndividuen: types.optional(types.maybeNull(types.number), null),
  form: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
  pflanzanordnung: types.optional(
    types.maybeNull(types.union(types.string, types.number)),
    null,
  ),
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
  vonAnzahlIndividuen: null,
  form: null,
  pflanzanordnung: null,
}

export const simpleTypes = {
  typ: 'number',
  beschreibung: 'string',
  jahr: 'number',
  datum: 'date',
  bearbeiter: 'uuid',
  bemerkungen: 'string',
  planVorhanden: 'number',
  planBezeichnung: 'string',
  flaeche: 'number',
  markierung: 'string',
  anzTriebe: 'number',
  anzPflanzen: 'number',
  anzPflanzstellen: 'number',
  wirtspflanze: 'string',
  herkunftPop: 'string',
  sammeldatum: 'string',
  vonAnzahlIndividuen: 'number',
  form: 'string',
  pflanzanordnung: 'string',
}
