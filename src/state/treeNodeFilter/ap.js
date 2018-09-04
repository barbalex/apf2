// @flow
import { Container } from 'unstated'

export type apType = {
  artId?: string,
  bearbeitung?: number,
  startJahr?: number,
  umsetzung?: number,
  bearbeiter?: number,
  ekfBeobachtungszeitpunkt?: string,
}

const initialState = {
  artId: null,
  bearbeitung: null,
  startJahr: null,
  umsetzung: null,
  bearbeiter: null,
  ekfBeobachtungszeitpunkt: null,
}

class ApContainer extends Container<apType> {
  state = initialState
  set(newState) {
    this.setState(() => newState)
  }
  setValue({ key, value }) {
    this.setState(state => ({ ...state, [key]: value }))
  }
  empty() {
    this.setState(() => initialState)
  }
}

export default ApContainer
