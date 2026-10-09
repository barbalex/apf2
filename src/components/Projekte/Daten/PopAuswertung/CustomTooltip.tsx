import { sortBy } from 'es-toolkit'

import { exists } from '../../../../modules/exists.ts'

import type { TpopId } from '../../../../models/apflora/index.ts'

import styles from './CustomTooltip.module.css'

const colorUrspruenglich = '#2e7d32'
const colorAngesiedelt = 'rgba(245,141,66,1)'

interface TpopData {
  id: TpopId
  nr: number | null
  label: string | null
  status: number | null
}

interface CustomTooltipProps {
  payload?: {
    dataKey: string
    value: number
  }[]
  label?: string | number
  active?: boolean
  tpopsData: TpopData[]
}

export const CustomTooltip = ({
  payload = [],
  label,
  tpopsData,
}: CustomTooltipProps) => {
  const payloadSorted = sortBy(payload, [
    (p) => {
      const tpop = tpopsData.find((d) => d.id === p.dataKey)
      if (tpop) return tpop.nr
      return p.dataKey
    },
  ])

  return (
    <div className={styles.container}>
      <div className={styles.title}>{label}</div>
      {payloadSorted.map((p) => {
        const tpop = tpopsData.find((d) => d.id === p.dataKey)
        let label: string | null = p.dataKey
        if (tpop) {
          label = tpop.label
        }
        const value =
          exists(p.value) && p.value?.toLocaleString
            ? p.value?.toLocaleString('de-ch')
            : null
        let color
        if (!tpop) {
          color = 'grey'
        } else {
          const isUrspruenglich = (tpop?.status ?? 0) < 200
          color = isUrspruenglich ? colorUrspruenglich : colorAngesiedelt
        }

        return (
          <div className={styles.row} key={p.dataKey} style={{ color }}>
            <div className={styles.label}>{`${label}:`}</div>
            <div>{value}</div>
          </div>
        )
      })}
    </div>
  )
}
