// @flow
import compose from 'recompose/compose'
import renameProps from 'recompose/renameProps'

import standardQkYear from '../../modules/standardQkYear'

const enhance = compose(
  renameProps({
    berichtjahr: 'berichtjahrPassed',
    messages: 'messagesPassed',
    filter: 'filterPassed',
  })
)

const setQk = ({
  store,
  tree,
  berichtjahrPassed,
  messagesPassed,
}: {
  store: Object,
  tree: Object,
  berichtjahrPassed: number,
  messagesPassed: Array<Object>,
}): void => {
  console.log('setQk running')
  const apArtId = tree.activeNodes.ap
  let berichtjahr = berichtjahrPassed
  const messages = messagesPassed || []
  const existingQk = store.qk.get(apArtId)

  if (!berichtjahr && berichtjahr !== 0) {
    const existingBerichtjahr =
      existingQk && existingQk.berichtjahr ? existingQk.berichtjahr : ''
    if (existingBerichtjahr) {
      berichtjahr = existingBerichtjahr
    } else {
      berichtjahr = standardQkYear()
    }
  }
  const value = {
    berichtjahr,
    messages,
  }
  console.log('setQk setting apArtId:', apArtId)
  console.log('setQk setting berichtjahr:', berichtjahr)
  store.qk.set(apArtId, value)
}

export default enhance(setQk)
