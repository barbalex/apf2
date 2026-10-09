import { TextField2 } from '../../../../shared/TextField2.tsx'
import type { TpopkontrRow, TpopkontrSaveToDb } from './index.tsx'
import styles from './Remarks.module.css'

interface RemarksProps {
  saveToDb: TpopkontrSaveToDb
  row: Partial<TpopkontrRow>
  errors: Record<string, string>
}

export const Remarks = ({ saveToDb, row, errors }: RemarksProps) => (
  <div className={styles.container}>
    <div className={styles.label}>
      Spezielle Bemerkungen
      <span className={styles.subLabel}>
        (z.B. allgemeiner Eindruck, Zunahme / Abnahme Begründung, spezielle
        Begebenheiten)
      </span>
    </div>
    <div className={styles.val}>
      <TextField2
        key={`${row?.id}bemerkungen`}
        name="bemerkungen"
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
