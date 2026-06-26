import { useState, useRef, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
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
} from '../../../../../models/apflora/index.tsx'

import {
  container,
  docLink,
  docLine,
  aenderung,
  aktuell,
  historyRowWrapper,
  historyButtons,
} from './index.module.css'

const query = gql`
  query popHistoryQuery($popId: UUID!) {
    popById(id: $popId) {
      id
      apId
      apByApId {
        id
        aeTaxonomyByArtId {
          id
          artname
        }
      }
      nr
      name
      label
      status
      popStatusWerteByStatus {
        id
        text
      }
      statusUnklar
      statusUnklarBegruendung
      bekanntSeit
      geomPoint {
        geojson
        x
        y
      }
      changedBy
    }
    allPopHistories(filter: { id: { equalTo: $popId } }, orderBy: YEAR_DESC) {
      totalCount
      nodes {
        id
        year
        apId
        apByApId {
          id
          aeTaxonomyByArtId {
            id
            artname
          }
        }
        nr
        name
        status
        popStatusWerteByStatus {
          id
          text
        }
        statusUnklar
        statusUnklarBegruendung
        bekanntSeit
        geomPoint {
          geojson
          x
          y
        }
        changedBy
      }
    }
    allPopStatusWertes(orderBy: CODE_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`

interface PopHistoryData {
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
  status: PopStatusWerteCode | null
  popStatusWerteByStatus?: {
    id: PopStatusWerteCode
    text: string | null
  }
  statusUnklar: boolean | null
  statusUnklarBegruendung: string | null
  bekanntSeit: number | null
  geomPoint?: {
    geojson: unknown
    x: number | null
    y: number | null
  }
  changedBy: string | null
}

type PopHistoryRow = PopHistoryData & { year: number | null }

interface PopHistoryQueryResult {
  popById?: PopHistoryData & {
    label: string | null
  }
  allPopHistories?: {
    totalCount: number
    nodes: Array<
      PopHistoryData & {
        year: number | null
      }
    >
  }
  allPopStatusWertes?: {
    nodes: Array<{ value: number; label: string }>
  }
}

export const Component = () => {
  const { popId } = useParams()
  const apolloClient = useApolloClient()

  const { data, refetch } = useQuery({
    queryKey: ['popHistory', popId],
    queryFn: async () => {
      const result = await apolloClient.query<PopHistoryQueryResult>({
        query,
        variables: { popId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
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
      <div className={container}>
        <p className={docLine}>
          Jährlich historisierte Daten der Population (
          <span
            className={docLink}
            onClick={openDocs}
          >
            Dokumentation
          </span>
          ).
        </p>
        <p className={docLine}>
          <span className={aenderung}>Änderungen</span> zum{' '}
          <span className={aktuell}>aktuellen Zustand</span> sind
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
                refetch={refetch}
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
              valueInRow: row?.geomPoint?.x,
              valueInHist: r?.geomPoint?.x,
              label: 'Längengrad',
            },
            {
              valueInRow: row?.geomPoint?.y,
              valueInHist: r?.geomPoint?.y,
              label: 'Breitengrad',
            },
          ]

          return (
            <div
              key={r.year}
              className={historyRowWrapper}
            >
              <div className={historyButtons}>
                <Tooltip title="bearbeiten">
                  <IconButton
                    size="small"
                    onClick={() => setEditingYear(r.year)}
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
            refetch={refetch}
          />
        )}
        <div ref={bottomRef} />
      </div>
    </>
  )
}
