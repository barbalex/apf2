import { exists } from '../../../../modules/exists.js'
import { popup, title, row, label } from './CustomTooltip.module.css'

export const CustomTooltip = ({
  payload = [],
  label,
  active,
  color,
  reverse,
}) => {
  const data = reverse ? payload : (payload?.reverse() ?? [])

  return (
    <div className={popup}>
      <div className={title}>{label}</div>
      {data.map((o, i) => {
        const value =
          exists(o.value) && o.value?.toLocaleString ?
            o.value?.toLocaleString('de-ch')
          : null

        return (
          <div
            key={`${i}/${o.dataKey}`}
            style={{ color: color[o.dataKey] }}
            className={row}
          >
            <div className={label}>{`${o.dataKey}:`}</div>
            <div>{value}</div>
          </div>
        )
      })}
    </div>
  )
}
