import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { Spinner } from '../../../shared/Spinner.jsx'
import { History as HistoryComponent } from '../../../shared/History/index.jsx'
import { appBaseUrl } from '../../../../modules/appBaseUrl.js'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

import {
  container,
  errorContainer,
  docLink,
  docLine,
  aenderung,
  aktuell,
} from './Historien.module.css'

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

const simplebarStyle = { maxHeight: '100%', height: '100%' }

export const Component = () => {
  const { popId } = useParams()

  const { error, data, loading } = useQuery(query, {
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
    return <div className={errorContainer}>{error.message}</div>
  }

  return (
    <>
      <FormTitle title={`${label}: Historien`} />
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
          <span className={aktuell}>aktuellen Zustand</span> sind hervorgehoben.
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
