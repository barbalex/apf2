import { apiFetch } from '../../../../../modules/api.ts'
import { useState, useRef, useEffect } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { Tooltip, IconButton } from '@mui/material'
import { MdEdit } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa6'

import { History as HistoryComponent } from '../../../../shared/History/index.tsx'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'
import { HistorienMenu } from './HistorienMenu.tsx'
import { HistoryForm } from './HistoryForm.tsx'

import type {
  PopId,
  ApId,
  AeTaxonomiesId,
  PopStatusWerteCode,
} from '../../../../../models/apflora/index.ts'

import indexStyles from './index.module.css'

interface PopHistoryData {
  label?: string | null
  year?: number | null
  id: PopId
  apId: ApId
  apByApId?: {
    id: ApId
    aeTaxonomyByArtId?: {
      id: AeTaxonomiesId
      artname: string | null
    }
  }
  nr: number | null
  name: string | null
  status: number | null
  popStatusWerteByStatus?: {
    id: PopStatusWerteCode
    text: string | null
  }
  statusUnklar: boolean | null
  statusUnklarBegruendung: string | null
  bekanntSeit: number | null
  /** GeoJSON object; [0]/[1] are the former x/y (long/lat) */
  geomPoint?: {
    type: string
    coordinates: [number, number]
  }
  changedBy: string | null
}

type PopHistoryRow = PopHistoryData & { year?: number | null | undefined }

export const Component = () => {
  const { popId } = useParams()

  const { data, refetch } = useSuspenseQuery({
    queryKey: ['popHistory', popId],
    queryFn: async () => {
      const commonSelect =
        'id,apId:ap_id,apByApId:ap_by_ap_id,nr,name,status,statusUnklar:status_unklar,statusUnklarBegruendung:status_unklar_begruendung,bekanntSeit:bekannt_seit,geomPoint:geom_point,changedBy:changed_by'
      const [popRows, historyRows, statusWerte] = await Promise.all([
        apiFetch<PopHistoryData[]>(
          `/v_pop?id=eq.${popId}&select=${commonSelect},label`,
        ),
        apiFetch<PopHistoryData[]>(
          `/v_pop_history?id=eq.${popId}&select=${commonSelect},year,popStatusWerteByStatus:pop_status_werte_by_status&order=year.desc`,
        ),
        apiFetch<{ value: number; label: string }[]>(
          `/pop_status_werte?order=code.asc&select=value:code,label:text`,
        ),
      ])
      return {
        popById: popRows?.[0] ?? null,
        allPopHistories: {
          nodes: historyRows ?? [],
          totalCount: historyRows?.length ?? 0,
        },
        allPopStatusWertes: { nodes: statusWerte ?? [] },
      }
    },
  })

  const [editingYear, setEditingYear] = useState<number | 'new' | null>(null)
  const [copyFrom, setCopyFrom] = useState<PopHistoryRow | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const row = data?.popById
  const rows = data?.allPopHistories?.nodes ?? []
  const label = row?.label ?? 'Population'

  const options = {
    popStatusWertes: data?.allPopStatusWertes?.nodes ?? [],
  }

  const handleAdd = () => {
    setCopyFrom(null)
    setEditingYear('new')
  }

  const handleCopy = (r: PopHistoryRow) => {
    setCopyFrom(r)
    setEditingYear('new')
  }

  useEffect(() => {
    if (editingYear === 'new') {
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }),
        0,
      )
    }
  }, [editingYear])

  const openDocs = () => {
    const url = `${appBaseUrl()}Dokumentation/historisierung`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  return (
    <>
      <FormTitle
        title={`${label}: Historien`}
        MenuBarComponent={HistorienMenu}
        menuBarProps={{ onAdd: handleAdd }}
      />
      <div className={indexStyles.container}>
        <p className={indexStyles.docLine}>
          Jährlich historisierte Daten der Population (
          <span
            className={indexStyles.docLink}
            onClick={openDocs}
          >
            Dokumentation
          </span>
          ).
        </p>
        <p className={indexStyles.docLine}>
          <span className={indexStyles.aenderung}>Änderungen</span> zum{' '}
          <span className={indexStyles.aktuell}>aktuellen Zustand</span> sind
          hervorgehoben.
        </p>
        {rows.map((r) => {
          if (editingYear === r.year) {
            return (
              <HistoryForm
                key={r.year}
                isNew={false}
                historyRow={r}
                options={options}
                onClose={() => setEditingYear(null)}
                refetch={() => void refetch()}
              />
            )
          }

          const dataArray = [
            {
              valueInRow:
                row?.apByApId?.aeTaxonomyByArtId?.artname ?? row?.apId,
              valueInHist: r?.apByApId?.aeTaxonomyByArtId?.artname ?? r?.apId,
              label: 'Art',
            },
            {
              valueInRow: row?.nr,
              valueInHist: r?.nr,
              label: 'Nr.',
            },
            {
              valueInRow: row?.name,
              valueInHist: r?.name,
              label: 'Name',
            },
            {
              valueInRow: row?.bekanntSeit,
              valueInHist: r?.bekanntSeit,
              label: 'bekannt seit',
            },
            {
              valueInRow: row?.popStatusWerteByStatus?.text ?? row?.status,
              valueInHist: r?.popStatusWerteByStatus?.text ?? r?.status,
              label: 'Status',
            },
            {
              valueInRow: row?.statusUnklar,
              valueInHist: r?.statusUnklar,
              label: 'Status unklar',
            },
            {
              valueInRow: row?.statusUnklarBegruendung,
              valueInHist: r?.statusUnklarBegruendung,
              label: 'Begründung (für Status unklar)',
            },
            {
              valueInRow: row?.geomPoint?.coordinates?.[0],
              valueInHist: r?.geomPoint?.coordinates?.[0],
              label: 'Längengrad',
            },
            {
              valueInRow: row?.geomPoint?.coordinates?.[1],
              valueInHist: r?.geomPoint?.coordinates?.[1],
              label: 'Breitengrad',
            },
          ]

          return (
            <div
              key={r.year}
              className={indexStyles.historyRowWrapper}
            >
              <div className={indexStyles.historyButtons}>
                <Tooltip title="bearbeiten">
                  <IconButton
                    size="small"
                    onClick={() => setEditingYear(r.year ?? null)}
                  >
                    <MdEdit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="diese Historie in neue kopieren">
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(r)}
                  >
                    <FaPlus />
                  </IconButton>
                </Tooltip>
              </div>
              <HistoryComponent
                key={`${r.id}${r.year}`}
                year={r?.year}
                dataArray={dataArray}
              />
            </div>
          )
        })}
        {editingYear === 'new' && (
          <HistoryForm
            isNew={true}
            historyRow={copyFrom ?? undefined}
            options={options}
            onClose={() => {
              setEditingYear(null)
              setCopyFrom(null)
            }}
            refetch={() => void refetch()}
          />
        )}
        <div ref={bottomRef} />
      </div>
    </>
  )
}
