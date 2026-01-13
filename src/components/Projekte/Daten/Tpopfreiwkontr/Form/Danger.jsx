import { TextField2 } from '../../../../shared/TextField2.jsx'
import styles from './Danger.module.css'

export const Danger = ({ saveToDb, row, errors }) => (
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
        row={row}
        type="text"
        multiLine
        saveToDb={saveToDb}
        errors={errors}
      />
    </div>
  </div>
)
