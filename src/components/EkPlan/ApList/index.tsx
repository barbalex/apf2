import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { FaPlus } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { Ap } from './Ap/index.tsx'
import { ChooseAp } from './ChooseAp/index.tsx'
import { ekPlanApsAtom } from '../../../store/index.ts'

import styles from './index.module.css'

export const ApList = () => {
  const aps = useAtomValue(ekPlanApsAtom)

  const [showChoose, setShowChoose] = useState(aps.length === 0)
  const onClickAdd = () => setShowChoose(true)

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.apTitle}>Arten</div>
        {!showChoose && (
          <Tooltip title="Art hinzufügen">
            <IconButton
              aria-label="Art hinzufügen"
              onClick={onClickAdd}
              className={styles.plusIcon}
            >
              <FaPlus />
            </IconButton>
          </Tooltip>
        )}
      </div>
      {aps.map((ap) => (
        <Ap
          key={ap.value}
          ap={ap}
        />
      ))}
      {(aps.length === 0 || showChoose) && (
        <ChooseAp setShowChoose={setShowChoose} />
      )}
    </div>
  )
}
