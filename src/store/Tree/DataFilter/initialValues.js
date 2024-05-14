import { initial as ap } from './ap.js'
import { initial as pop } from './pop.js'
import { initial as tpop } from './tpop.js'
import { initial as tpopmassn } from './tpopmassn.js'
import { initial as tpopfeldkontr } from './tpopfeldkontr.js'
import { initial as tpopfreiwkontr } from './tpopfreiwkontr.js'

const initialValues = {
  ap: [ap],
  pop: [pop],
  tpop: [tpop],
  tpopfeldkontr: [tpopfeldkontr],
  tpopfreiwkontr: [tpopfreiwkontr],
  tpopmassn: [tpopmassn],
}

export default initialValues
