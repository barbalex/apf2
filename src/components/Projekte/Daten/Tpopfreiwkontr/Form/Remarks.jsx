import { TextField2 } from '../../../../shared/TextField2.jsx'
import { container, label, subLabel, val } from './Remarks.module.css'

export const Remarks = ({ saveToDb, row, errors }) => (
  <div className={container}>
    <div className={label}>
      Spezielle Bemerkungen
      <span className={subLabel}>
        (z.B. allgemeiner Eindruck, Zunahme / Abnahme Begründung, spezielle
        Begebenheiten)
      </span>
    </div>
    <div className={val}>
      <TextField2
        key={`${row.id}bemerkungen`}
        name="bemerkungen"
        row={row}
        type="text"
        multiLine
        saveToDb={saveToDb}
        errors={errors}
      />
    </div>
  </div>
)
