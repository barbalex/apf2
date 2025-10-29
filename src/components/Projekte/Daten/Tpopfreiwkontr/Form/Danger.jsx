import { TextField2 } from '../../../../shared/TextField2.jsx'
import { container, label, subLabel, val } from './Danger.module.css'

export const Danger = ({ saveToDb, row, errors }) => (
  <div className={container}>
    <div className={label}>
      Gefährdung{' '}
      <span className={subLabel}>
        (Problemarten, Verbuschung, Tritt, Hunde, ...), welche?
      </span>
    </div>
    <div className={val}>
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
