import { initial as ap } from './ap.ts'
import { initial as pop } from './pop.ts'
import { initial as tpop } from './tpop.ts'
import { initial as tpopmassn } from './tpopmassn.ts'
import { initial as tpopfeldkontr } from './tpopfeldkontr.ts'
import { initial as tpopfreiwkontr } from './tpopfreiwkontr.ts'

export const initialDataFilterValues = {
  ap: [ap],
  pop: [pop],
  tpop: [tpop],
  tpopfeldkontr: [tpopfeldkontr],
  tpopfreiwkontr: [tpopfreiwkontr],
  tpopmassn: [tpopmassn],
}
