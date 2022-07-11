import { types } from 'mobx-state-tree'

import { type as ap } from './ap'
import { type as pop } from './pop'
import { type as tpop } from './tpop'
import { type as tpopfeldkontr } from './tpopfeldkontr'
import { type as tpopfreiwkontr } from './tpopfreiwkontr'
import { type as tpopmassn } from './tpopmassn'

export default types.model({
  ap: types.array(ap),
  pop: types.array(pop),
  tpop: types.array(tpop),
  tpopfeldkontr: types.array(tpopfeldkontr),
  tpopfreiwkontr: types.array(tpopfreiwkontr),
  tpopmassn: types.array(tpopmassn),
})
