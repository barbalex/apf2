import { DateField as DateFieldComponent } from '../../../../shared/Date.tsx'
import type { TpopkontrRow, TpopkontrSaveToDb } from './index.tsx'

import styles from './Date.module.css'

interface DateFieldProps {
  saveToDb: TpopkontrSaveToDb
  row: Partial<TpopkontrRow>
  errors: Record<string, string>
}

export const DateField = ({ saveToDb, row, errors }: DateFieldProps) => (
  <div className={styles.container}>
    <div className={styles.label}>Aufnahme-datum</div>
    <div className={styles.val}>
      <DateFieldComponent
        key={`${row?.id}datum`}
        name="datum"
        label={undefined}
        value={row?.datum}
        saveToDb={saveToDb}
        error={errors?.datum}
      />
    </div>
  </div>
)
