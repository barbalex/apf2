import { initial as ap } from './ap'
import { initial as pop } from './pop'
import { initial as tpop } from './tpop'
import { initial as tpopmassn } from './tpopmassn'
import { initial as tpopfeldkontr } from './tpopfeldkontr'
import { initial as tpopfreiwkontr } from './tpopfreiwkontr'

const initialValues = {
  ap: [ap],
  pop: [pop],
  tpop: [tpop],
  tpopfeldkontr: [tpopfeldkontr],
  tpopfreiwkontr: [tpopfreiwkontr],
  tpopmassn: [tpopmassn],
}

export default initialValues
