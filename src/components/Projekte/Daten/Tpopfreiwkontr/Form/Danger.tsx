import { TextField2 } from '../../../../shared/TextField2.tsx'
import type { TpopkontrRow, TpopkontrSaveToDb } from './index.tsx'
import styles from './Danger.module.css'

interface DangerProps {
  saveToDb: TpopkontrSaveToDb
  row: Partial<TpopkontrRow>
  errors: Record<string, string>
}

export const Danger = ({ saveToDb, row, errors }: DangerProps) => (
  <div className={styles.container}>
    <div className={styles.label}>
      Gefährdung{' '}
      <span className={styles.subLabel}>
        (Problemarten, Verbuschung, Tritt, Hunde, ...), welche?
      </span>
    </div>
    <div className={styles.val}>
      <TextField2
        key={`${row.id}gefaehrdung`}
        name="gefaehrdung"
        label={undefined}
        row={row}
        type="text"
        multiLine
        saveToDb={saveToDb}
        errors={errors}
      />
    </div>
  </div>
)
