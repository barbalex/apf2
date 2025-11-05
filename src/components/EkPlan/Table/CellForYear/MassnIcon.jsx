import { useContext } from 'react'
import { sum } from 'es-toolkit'
import { GoZap } from 'react-icons/go'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../../mobxContext.js'
import {
  container,
  massnContainer,
  massnSymbol,
  nrOfMassn,
  sumCounted,
} from './MassnIcon.module.css'

export const MassnIcon = observer(({ ansiedlungs }) => {
  const store = useContext(MobxContext)
  const { showCount, showEkCount } = store.ekPlan

  if (!ansiedlungs.length) {
    return <div className={container}>&nbsp;</div>
  }

  let sumCounted = null
  const ansiedlungsWithCount = ansiedlungs.filter(
    (ans) => ans.zieleinheitAnzahl !== null,
  )
  if (ansiedlungsWithCount.length) {
    sumCounted = sum(ansiedlungsWithCount.map((ans) => ans.zieleinheitAnzahl))
  }

  return (
    <div
      className={container}
      style={{ justifyContent: showCount ? 'space-between' : 'center' }}
    >
      <div className={massnContainer}>
        <GoZap className={massnSymbol} />
        {showEkCount && ansiedlungs.length > 1 && (
          <div className={nrOfMassn}>{ansiedlungs.length}</div>
        )}
      </div>
      {showCount && (
        <div className={sumCounted}>
          {sumCounted !== null ? sumCounted : ' '}
        </div>
      )}
    </div>
  )
})
