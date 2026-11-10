import { sortBy } from 'es-toolkit'
import MuiTooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { FaDownload } from 'react-icons/fa'

import { exists } from '../../../../../modules/exists.ts'
import { exportXlsx } from '../../../../../modules/exportXlsx.ts'

import type { PopId } from '../../../../../models/apflora/Pop.ts'

import styles from './CustomTooltip.module.css'

const colorUrspruenglich = '#2e7d32'
const colorAngesiedelt = 'rgba(245,141,66,1)'

// same colors as the popup, as hex for the xlsx cells
const exportColorUrspruenglich = '#2e7d32'
const exportColorAngesiedelt = '#f58d42'
const exportColorUnbekannt = '#808080'

interface PopData {
  id: PopId
  nr: number | null
  name: string | null
  status: number | null
}

interface CustomTooltipProps {
  payload?: {
    dataKey: string
    value: number
  }[]
  label?: string | number
  active?: boolean
  popsData: PopData[]
  zielEinheit?: string
  /** max height of the scrolling rows area, adapted to the chart height */
  rowsMaxHeight?: number
}

export const CustomTooltip = ({
  payload = [],
  label,
  popsData,
  zielEinheit,
  rowsMaxHeight,
}: CustomTooltipProps) => {
  const payloadSorted = sortBy(payload, [
    (p) => {
      const pop = popsData.find((d) => d.id === p.dataKey)
      if (pop) return pop.nr
      return p.dataKey
    },
  ])

  const onClickExport = () => {
    const einheit = zielEinheit ?? 'Anzahl'
    const rows = payloadSorted.map((p) => {
      const pop = popsData.find((d) => d.id === p.dataKey)
      const herkunft = !pop ?
        'unbekannt'
      : (pop.status ?? 0) < 200 ? 'ursprünglich' : 'angesiedelt'
      return {
        Nr: pop?.nr ?? null,
        Population: pop?.name ?? null,
        [einheit]: p.value,
        Herkunft: herkunft,
      }
    })
    const exportColors: Record<string, string> = {
      ursprünglich: exportColorUrspruenglich,
      angesiedelt: exportColorAngesiedelt,
      unbekannt: exportColorUnbekannt,
    }
    void exportXlsx({
      fileName: `PopMengen_${label ?? ''}`,
      data: rows,
      getCellStyle: ({ row }) => ({
        textColor:
          exportColors[(row as { Herkunft?: string }).Herkunft ?? ''] ??
          exportColorUnbekannt,
      }),
    })
  }

  return (
    <div
      className={styles.popup}
      // freeze the popup while the cursor is inside it:
      // recharts must neither move it nor switch to another year,
      // else the export button can not be clicked
      onMouseMove={(e) => e.stopPropagation()}
    >
      <div className={styles.titleRow}>
        <div className={styles.title}>{label}</div>
        <MuiTooltip title="Liste als Excel-Datei (xlsx) exportieren">
          <IconButton
            aria-label="Liste als Excel-Datei (xlsx) exportieren"
            className={styles.exportButton}
            onClick={onClickExport}
            size="small"
          >
            <FaDownload />
          </IconButton>
        </MuiTooltip>
      </div>
      <div
        className={styles.rows}
        style={rowsMaxHeight ? { maxHeight: rowsMaxHeight } : undefined}
      >
        {payloadSorted.map((p) => {
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
            const isUrspruenglich = (pop?.status ?? 0) < 200
            color = isUrspruenglich ? colorUrspruenglich : colorAngesiedelt
          }

          return (
            <div
              className={styles.row}
              key={p.dataKey}
              style={{ color }}
            >
              <div className={styles.label}>{`${label}:`}</div>
              <div>{value}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
