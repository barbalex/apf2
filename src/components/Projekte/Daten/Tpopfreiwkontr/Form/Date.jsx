import { DateField as DateFieldComponent } from '../../../../shared/Date.jsx'
import { container, label, val } from './Date.module.css'

export const DateField = ({ saveToDb, row, errors }) => (
  <div className={container}>
    <div className={label}>Aufnahme-datum</div>
    <div className={val}>
      <DateFieldComponent
        key={`${row.id}datum`}
        name="datum"
        value={row.datum}
        saveToDb={saveToDb}
        error={errors.datum}
      />
    </div>
  </div>
)
