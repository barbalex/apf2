import { exists } from '../../../../modules/exists.ts'
import styles from './CustomTooltip.module.css'

interface CustomTooltipProps {
  payload?: {
    dataKey: string
    value: number
  }[]
  label?: string | number
  active?: boolean
  color: Record<string, string>
  reverse?: boolean
}

export const CustomTooltip = ({
  payload = [],
  label,
  color,
  reverse,
}: CustomTooltipProps) => {
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
