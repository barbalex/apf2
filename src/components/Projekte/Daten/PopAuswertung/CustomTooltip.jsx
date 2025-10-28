import { sortBy } from 'es-toolkit'

import { exists } from '../../../../modules/exists.js'
import {
  container,
  title,
  row,
  label as labelClass,
} from './CustomTooltip.module.css'

const colorUrspruenglich = '#2e7d32'
const colorAngesiedelt = 'rgba(245,141,66,1)'

export const CustomTooltip = ({ payload = [], label, active, tpopsData }) => {
  const payloadSorted = sortBy(payload, [
    (p) => {
      const tpop = tpopsData.find((d) => d.id === p.dataKey)
      if (tpop) return tpop.nr
      return p.dataKey
    },
  ])

  return (
    <div className={container}>
      <div className={title}>{label}</div>
      {payloadSorted.map((p, i) => {
        const tpop = tpopsData.find((d) => d.id === p.dataKey)
        let label = p.dataKey
        if (tpop) {
          label = tpop.label
        }
        const value =
          exists(p.value) && p.value?.toLocaleString ?
            p.value?.toLocaleString('de-ch')
          : null
        let color
        if (!tpop) {
          color = 'grey'
        } else {
          const isUrspruenglich = tpop?.status < 200
          color = isUrspruenglich ? colorUrspruenglich : colorAngesiedelt
        }

        return (
          <div
            className={row}
            key={p.dataKey}
            style={{ color }}
          >
            <div className={labelClass}>{`${label}:`}</div>
            <div>{value}</div>
          </div>
        )
      })}
    </div>
  )
}
