import { TextField2 } from '../../../../shared/TextField2.tsx'
import type { TpopkontrRow, TpopkontrSaveToDb } from './index.tsx'
import styles from './EkfRemarks.module.css'

interface EkfRemarksProps {
  saveToDb: TpopkontrSaveToDb
  row: Partial<TpopkontrRow>
  errors: Record<string, string>
}

export const EkfRemarks = ({ saveToDb, row, errors }: EkfRemarksProps) => (
  <div className={styles.container}>
    <div className={styles.label}>
      Mitteilungen zwischen AV/Topos und Freiwilligen
    </div>
    <div className={styles.val}>
      <TextField2
        key={`${row?.id}ekfBemerkungen`}
        name="ekfBemerkungen"
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
