import { useState, useRef, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { MdEdit } from 'react-icons/md'

import { History as HistoryComponent } from '../../../../shared/History/index.tsx'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'
import { HistorienMenu } from './HistorienMenu.tsx'
import { HistoryForm } from './HistoryForm.tsx'

import type { ApId } from '../../../../../models/apflora/Ap.ts'
import type { AeTaxonomiesId } from '../../../../../models/apflora/AeTaxonomies.ts'
import type { ApBearbstandWerteCode } from '../../../../../models/apflora/ApBearbstandWerte.ts'
import type { ApUmsetzungWerteCode } from '../../../../../models/apflora/ApUmsetzungWerte.ts'
import type { AdresseId } from '../../../../../models/apflora/Adresse.ts'
import type { ProjektId } from '../../../../../models/apflora/Projekt.ts'

import {
  innerContainer,
  errorContainer,
  docLink,
  docLine,
  aenderung,
  aktuell,
  historyRowWrapper,
  editButton,
} from './index.module.css'

interface ApHistoryNode {
  id: string
  year: number
  artId: AeTaxonomiesId | null
  aeTaxonomyByArtId: {
    id: AeTaxonomiesId
    artname: string
  } | null
  bearbeitung: ApBearbstandWerteCode | null
  apBearbstandWerteByBearbeitung: {
    id: number
    text: string
  } | null
  startJahr: number | null
  umsetzung: ApUmsetzungWerteCode | null
  apUmsetzungWerteByUmsetzung: {
    id: number
    text: string
  } | null
  bearbeiter: AdresseId | null
  adresseByBearbeiter: {
    id: AdresseId
    name: string
  } | null
  ekfBeobachtungszeitpunkt: string | null
}

interface ApHistoriesQueryResult {
  apById: {
    id: ApId
    label: string
    artId: AeTaxonomiesId | null
    aeTaxonomyByArtId: {
      id: AeTaxonomiesId
      artname: string
    } | null
    bearbeitung: ApBearbstandWerteCode | null
    apBearbstandWerteByBearbeitung: {
      id: number
      text: string
    } | null
    startJahr: number | null
    umsetzung: ApUmsetzungWerteCode | null
    apUmsetzungWerteByUmsetzung: {
      id: number
      text: string
    } | null
    bearbeiter: AdresseId | null
    adresseByBearbeiter: {
      id: AdresseId
      name: string
    } | null
    ekfBeobachtungszeitpunkt: string | null
    projId: ProjektId
    projektByProjId: {
      id: ProjektId
      name: string
    }
    changedBy: string | null
  }
  allApHistories: {
    totalCount: number
    nodes: ApHistoryNode[]
  }
  allAdresses: {
    nodes: Array<{ value: AdresseId; label: string }>
  }
  allApBearbstandWertes: {
    nodes: Array<{ value: number; label: string }>
  }
  allApUmsetzungWertes: {
    nodes: Array<{ value: number; label: string }>
  }
}

const apHistoriesQuery = gql`
  query apHistoryQuery($apId: UUID!) {
    apById(id: $apId) {
      id
      label
      artId
      aeTaxonomyByArtId {
        id
        artname
      }
      bearbeitung
      apBearbstandWerteByBearbeitung {
        id
        text
      }
      startJahr
      umsetzung
      apUmsetzungWerteByUmsetzung {
        id
        text
      }
      artId
      bearbeiter
      adresseByBearbeiter {
        id
        name
      }
      ekfBeobachtungszeitpunkt
      projId
      projektByProjId {
        id
        name
      }
      changedBy
    }
    allApHistories(filter: { id: { equalTo: $apId } }, orderBy: YEAR_DESC) {
      totalCount
      nodes {
        id
        year
        artId
        aeTaxonomyByArtId {
          id
          artname
        }
        bearbeitung
        apBearbstandWerteByBearbeitung {
          id
          text
        }
        startJahr
        umsetzung
        apUmsetzungWerteByUmsetzung {
          id
          text
        }
        artId
        bearbeiter
        adresseByBearbeiter {
          id
          name
        }
        ekfBeobachtungszeitpunkt
      }
    }
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
    allApBearbstandWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allApUmsetzungWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`

export const Component = () => {
  const apolloClient = useApolloClient()

  const { apId } = useParams<{ apId: string }>()
  const { data, refetch } = useQuery({
    queryKey: ['apHistories', apId],
    queryFn: async () => {
      const result = await apolloClient.query<ApHistoriesQueryResult>({
        query: apHistoriesQuery,
        variables: { apId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const [editingYear, setEditingYear] = useState<number | 'new' | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const row = data.apById
  const rows = data.allApHistories.nodes ?? []
  const artname = row?.aeTaxonomyByArtId?.artname ?? 'Art'

  const options = {
    adresses: data.allAdresses?.nodes ?? [],
    apBearbstandWertes: data.allApBearbstandWertes?.nodes ?? [],
    apUmsetzungWertes: data.allApUmsetzungWertes?.nodes ?? [],
  }

  const handleAdd = () => {
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
        title={`${artname}: Historien`}
        MenuBarComponent={HistorienMenu}
        menuBarProps={{ onAdd: handleAdd }}
      />
      <div className={innerContainer}>
        <p className={docLine}>
          Jährlich historisierte Daten der Art (
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
          if (editingYear === r.year) {
            return (
              <HistoryForm
                key={r.year}
                isNew={false}
                artId={row?.artId ?? null}
                historyRow={r}
                options={options}
                onClose={() => setEditingYear(null)}
                refetch={refetch}
              />
            )
          }

          const dataArray = [
            {
              valueInRow: row?.aeTaxonomyByArtId?.artname ?? row?.artId,
              valueInHist: r?.aeTaxonomyByArtId?.artname ?? r?.artId,
              label: 'Art (id)',
            },
            {
              valueInRow:
                row?.apBearbstandWerteByBearbeitung?.text ?? row?.bearbeitung,
              valueInHist:
                r?.apBearbstandWerteByBearbeitung?.text ?? r?.bearbeitung,
              label: 'Aktionsplan',
            },
            {
              valueInRow:
                row?.apUmsetzungWerteByUmsetzung?.text ?? row?.umsetzung,
              valueInHist: r?.apUmsetzungWerteByUmsetzung?.text ?? r?.umsetzung,
              label: 'Stand Umsetzung',
            },
            {
              valueInRow: row?.adresseByBearbeiter?.name ?? row?.bearbeiter,
              valueInHist: r?.adresseByBearbeiter?.name ?? r?.bearbeiter,
              label: 'Verantwortlich',
            },
            {
              valueInRow: row?.startJahr,
              valueInHist: r?.startJahr,
              label: 'Start im Jahr',
            },
            {
              valueInRow: row?.ekfBeobachtungszeitpunkt,
              valueInHist: r?.ekfBeobachtungszeitpunkt,
              label: 'Bester Beobachtungszeitpunkt für EKF',
            },
          ]

          return (
            <div
              key={r.year}
              className={historyRowWrapper}
            >
              <Tooltip title="bearbeiten">
                <IconButton
                  className={editButton}
                  size="small"
                  onClick={() => setEditingYear(r.year)}
                >
                  <MdEdit />
                </IconButton>
              </Tooltip>
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
            artId={row?.artId ?? null}
            options={options}
            onClose={() => setEditingYear(null)}
            refetch={refetch}
          />
        )}
        <div ref={bottomRef} />
      </div>
    </>
  )
}
