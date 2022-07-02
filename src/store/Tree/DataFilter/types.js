import { types } from 'mobx-state-tree'

import { type as ap } from './ap'
import { type as pop } from './pop'
import { type as tpop } from './tpop'
import { type as tpopfeldkontr } from './tpopfeldkontr'
import { type as tpopfreiwkontr } from './tpopfreiwkontr'
import { type as tpopmassn } from './tpopmassn'

export default types.model({
  ap: types.array(ap),
  pop,
  tpop,
  tpopfeldkontr,
  tpopfreiwkontr,
  tpopmassn,
})
