import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { Spinner } from '../../../shared/Spinner.tsx'
import { History as HistoryComponent } from '../../../shared/History/index.tsx'
import { appBaseUrl } from '../../../../modules/appBaseUrl.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type {
  PopId,
  ApId,
  AeTaxonomiesId,
  PopStatusWerteCode,
} from '../../../../models/apflora/index.tsx'

import styles from './Historien.module.css'

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
}

const simplebarStyle = { maxHeight: '100%', height: '100%' }

export const Component = () => {
  const { popId } = useParams()

  const { error, data, loading } = useQuery<PopHistoryQueryResult>(query, {
    variables: {
      popId,
    },
  })

  const row = data?.popById
  const rows = data?.allPopHistories.nodes ?? []
  const label = row?.label ?? 'Population'

  const openDocs = () => {
    const url = `${appBaseUrl()}Dokumentation/historisierung`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  if (loading) {
    return <Spinner message="lade Historien" />
  }

  if (error) {
    return <div className={styles.errorContainer}>{error.message}</div>
  }

  return (
    <>
      <FormTitle title={`${label}: Historien`} />
      <div className={styles.container}>
        <p className={styles.docLine}>
          Jährlich historisierte Daten der Population (
          <span
            className={styles.docLink}
            onClick={openDocs}
          >
            Dokumentation
          </span>
          ).
        </p>
        <p className={styles.docLine}>
          <span className={styles.aenderung}>Änderungen</span> zum{' '}
          <span className={styles.aktuell}>aktuellen Zustand</span> sind
          hervorgehoben.
        </p>
        {rows.map((r) => {
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
            <HistoryComponent
              key={`${r.id}${r.year}`}
              year={r?.year}
              dataArray={dataArray}
            />
          )
        })}
      </div>
    </>
  )
}
