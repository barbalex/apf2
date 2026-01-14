import { types } from 'mobx-state-tree'

import { type as ap } from './ap.ts'
import { type as pop } from './pop.ts'
import { type as tpop } from './tpop.ts'
import { type as tpopfeldkontr } from './tpopfeldkontr.ts'
import { type as tpopfreiwkontr } from './tpopfreiwkontr.ts'
import { type as tpopmassn } from './tpopmassn.ts'

export const DataFilter = types.model({
  ap: types.array(ap),
  pop: types.array(pop),
  tpop: types.array(tpop),
  tpopfeldkontr: types.array(tpopfeldkontr),
  tpopfreiwkontr: types.array(tpopfreiwkontr),
  tpopmassn: types.array(tpopmassn),
})
