// @flow
import dateFns from 'date-fns'
import compose from 'recompose/compose'
import renameProps from 'recompose/renameProps'

import buildQkMessages from './buildQkMessages'

const enhance = compose(
  renameProps({
    berichtjahr: `berichtjahrPassed`,
    messages: `messagesPassed`,
    filter: `filterPassed`
  })
)

const setQk = ({
  store,
  tree,
  berichtjahrPassed,
  messagesPassed,
  filterPassed
}: {
  store: Object,
  tree: Object,
  berichtjahrPassed: number,
  messagesPassed: Array<Object>,
  filterPassed: string
}): void => {
  const apArtId = tree.activeNodes.ap
  let berichtjahr = berichtjahrPassed
  const messages = messagesPassed || []
  let filter = filterPassed
  const existingQk = store.qk.get(apArtId)
  if (!berichtjahr && berichtjahr !== 0) {
    const existingBerichtjahr = existingQk && existingQk.berichtjahr
      ? existingQk.berichtjahr
      : ``
    if (existingBerichtjahr) {
      berichtjahr = existingBerichtjahr
    } else {
      const refDate = new Date()
      refDate.setMonth(refDate.getMonth() - 6)
      berichtjahr = parseInt(dateFns.format(refDate, `YYYY`), 10)
    }
  }
  if (!filter && filter !== ``) {
    filter = existingQk && existingQk.filter ? existingQk.filter : ``
  }
  const value = buildQkMessages({
    berichtjahr,
    messages,
    filter
  })
  store.qk.set(apArtId, value)
}

export default enhance(setQk)
