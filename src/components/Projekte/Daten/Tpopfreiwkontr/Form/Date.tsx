import { DateField as DateFieldComponent } from '../../../../shared/Date.tsx'
import styles from './Date.module.css'

export const DateField = ({ saveToDb, row, errors }) => (
  <div className={styles.container}>
    <div className={styles.label}>Aufnahme-datum</div>
    <div className={styles.val}>
      <DateFieldComponent
        key={`${row?.id}datum`}
        name="datum"
        value={row?.datum}
        saveToDb={saveToDb}
        error={errors?.datum}
      />
    </div>
  </div>
)
