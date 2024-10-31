import { types } from 'mobx-state-tree'

import { type as ap } from './ap.js'
import { type as pop } from './pop.js'
import { type as tpop } from './tpop.js'
import { type as tpopfeldkontr } from './tpopfeldkontr.js'
import { type as tpopfreiwkontr } from './tpopfreiwkontr.js'
import { type as tpopmassn } from './tpopmassn.js'

export const DataFilter = types.model({
  ap: types.array(ap),
  pop: types.array(pop),
  tpop: types.array(tpop),
  tpopfeldkontr: types.array(tpopfeldkontr),
  tpopfreiwkontr: types.array(tpopfreiwkontr),
  tpopmassn: types.array(tpopmassn),
})
