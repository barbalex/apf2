import { TextField2 } from '../../../../shared/TextField2.jsx'
import styles from './EkfRemarks.module.css'

export const EkfRemarks = ({ saveToDb, row, errors }) => (
  <div className={styles.container}>
    <div className={styles.label}>
      Mitteilungen zwischen AV/Topos und Freiwilligen
    </div>
    <div className={styles.val}>
      <TextField2
        key={`${row?.id}ekfBemerkungen`}
        name="ekfBemerkungen"
        row={row}
        type="text"
        multiLine
        saveToDb={saveToDb}
        errors={errors}
      />
    </div>
  </div>
)
