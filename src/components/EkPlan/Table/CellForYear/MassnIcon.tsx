import { useAtomValue } from 'jotai'
import { sum } from 'es-toolkit'
import { GoZap } from 'react-icons/go'

import {
  ekPlanShowCountAtom,
  ekPlanShowEkCountAtom,
} from '../../../../store/index.ts'
import styles from './MassnIcon.module.css'

export const MassnIcon = ({ ansiedlungs }) => {
  const showCount = useAtomValue(ekPlanShowCountAtom)
  const showEkCount = useAtomValue(ekPlanShowEkCountAtom)

  if (!ansiedlungs.length) {
    return <div className={styles.container}>&nbsp;</div>
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
      className={styles.container}
      style={{ justifyContent: showCount ? 'space-between' : 'center' }}
    >
      <div className={styles.massnContainer}>
        <GoZap className={styles.massnSymbol} />
        {showEkCount && ansiedlungs.length > 1 && (
          <div className={styles.nrOfMassn}>{ansiedlungs.length}</div>
        )}
      </div>
      {showCount && (
        <div className={styles.sumCounted}>
          {sumCounted !== null ? sumCounted : ' '}
        </div>
      )}
    </div>
  )
}
