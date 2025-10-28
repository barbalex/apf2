import { sortBy } from 'es-toolkit'

import { exists } from '../../../../../modules/exists.js'
import { popup, title, row, label } from './CustomTooltip.module.css'

const colorUrspruenglich = '#2e7d32'
const colorAngesiedelt = 'rgba(245,141,66,1)'

export const CustomTooltip = ({ payload = [], label, active, popsData }) => {
  const payloadSorted = sortBy(payload, [
    (p) => {
      const pop = popsData.find((d) => d.id === p.dataKey)
      if (pop) return pop.nr
      return p.dataKey
    },
  ])

  return (
    <div className={popup}>
      <div className={title}>{label}</div>
      {payloadSorted.map((p, i) => {
        const pop = popsData.find((d) => d.id === p.dataKey)

        let label = p.dataKey
        if (pop) {
          label = `${pop.nr || '(keine Nr)'}: ${pop.name || '(kein Name)'}`
        }

        const value =
          exists(p.value) && p.value?.toLocaleString ?
            p.value?.toLocaleString('de-ch')
          : null

        let color
        if (!pop) {
          color = 'grey'
        } else {
          const isUrspruenglich = pop?.status < 200
          color = isUrspruenglich ? colorUrspruenglich : colorAngesiedelt
        }

        return (
          <div
            className={row}
            key={p.dataKey}
            style={{ color }}
          >
            <div className={label}>{`${label}:`}</div>
            <div>{value}</div>
          </div>
        )
      })}
    </div>
  )
}
