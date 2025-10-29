import { TextField2 } from '../../../../shared/TextField2.jsx'
import { container, label, val } from './EkfRemarks.module.css'

export const EkfRemarks = ({ saveToDb, row, errors }) => (
  <div className={container}>
    <div className={label}>Mitteilungen zwischen AV/Topos und Freiwilligen</div>
    <div className={val}>
      <TextField2
        key={`${row.id}ekfBemerkungen`}
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
