import { exists } from '../../../../modules/exists.ts'
import styles from './CustomTooltip.module.css'

export const CustomTooltip = ({
  payload = [],
  label,
  active,
  color,
  reverse,
}) => {
  const data = reverse ? payload : (payload?.reverse() ?? [])

  return (
    <div className={styles.popup}>
      <div className={styles.title}>{label}</div>
      {data.map((o, i) => {
        const value =
          exists(o.value) && o.value?.toLocaleString ?
            o.value?.toLocaleString('de-ch')
          : null

        return (
          <div
            key={`${i}/${o.dataKey}`}
            style={{ color: color[o.dataKey] }}
            className={styles.row}
          >
            <div className={styles.label}>{`${o.dataKey}:`}</div>
            <div>{value}</div>
          </div>
        )
      })}
    </div>
  )
}
