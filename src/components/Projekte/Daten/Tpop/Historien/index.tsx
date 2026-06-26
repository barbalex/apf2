import { useState, useRef, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { Tooltip, IconButton } from '@mui/material'
import { MdEdit } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa6'

import { History as SharedHistory } from '../../../../shared/History/index.tsx'
import { appBaseUrl } from '../../../../../modules/appBaseUrl.ts'
import { FormTitle } from '../../../../shared/FormTitle/index.tsx'
import { HistorienMenu } from './HistorienMenu.tsx'
import { HistoryForm } from './HistoryForm.tsx'

import type {
  TpopId,
  PopId,
  TpopStatusWerteCode,
  TpopApberrelevantGrundWerteCode,
  EkfrequenzId,
  AdresseId,
} from '../../../../../generated/apflora/models.ts'

import {
  container,
  docLink,
  docLine,
  aenderung,
  aktuell,
  historyRowWrapper,
  historyButtons,
} from './index.module.css'

interface TpopHistoryItem {
  id: TpopId
  year?: number | null
  popId: PopId
  popByPopId?: {
    id: PopId
    label?: string | null
  } | null
  nr?: number | null
  gemeinde?: string | null
  flurname?: string | null
  geomPoint?: {
    geojson?: unknown
    x?: number | null
    y?: number | null
  } | null
  radius?: number | null
  hoehe?: number | null
  exposition?: string | null
  klima?: string | null
  neigung?: string | null
  beschreibung?: string | null
  katasterNr?: string | null
  status?: TpopStatusWerteCode | null
  popStatusWerteByStatus?: {
    id: TpopStatusWerteCode
    text?: string | null
  } | null
  statusUnklarGrund?: string | null
  apberRelevant?: boolean | null
  apberRelevantGrund?: TpopApberrelevantGrundWerteCode | null
  tpopApberrelevantGrundWerteByApberRelevantGrund?: {
    id: TpopApberrelevantGrundWerteCode
    text?: string | null
  } | null
  bekanntSeit?: number | null
  eigentuemer?: string | null
  kontakt?: string | null
  nutzungszone?: string | null
  bewirtschafter?: string | null
  bewirtschaftung?: string | null
  ekfrequenz?: EkfrequenzId | null
  ekfrequenzByEkfrequenz?: {
    id: EkfrequenzId
    code?: string | null
  } | null
  ekfrequenzAbweichend?: boolean | null
  ekfrequenzStartjahr?: number | null
  ekfKontrolleur?: AdresseId | null
  adresseByEkfKontrolleur?: {
    id: AdresseId
    name?: string | null
  } | null
  bemerkungen?: string | null
  statusUnklar?: boolean | null
  changedBy?: string | null
}

interface TpopHistoryQueryResult {
  tpopById?: TpopHistoryItem & {
    popByPopId?: {
      id: PopId
      label?: string | null
      apId?: string | null
    } | null
  }
  allTpopHistories: {
    totalCount: number
    nodes: TpopHistoryItem[]
  }
  allPopStatusWertes?: {
    nodes: Array<{ value: number; label: string }>
  }
  allTpopApberrelevantGrundWertes?: {
    nodes: Array<{ value: number; label: string }>
  }
  allAdresses?: {
    nodes: Array<{ value: string; label: string }>
  }
  allEkfrequenzs?: {
    nodes: Array<{ value: string; label: string }>
  }
}

const query = gql`
  query tpopHistoryQuery($tpopId: UUID!) {
    tpopById(id: $tpopId) {
      id
      popId
      popByPopId {
        id
        label
        apId
      }
      nr
      gemeinde
      flurname
      geomPoint {
        geojson
        x
        y
      }
      radius
      hoehe
      exposition
      klima
      neigung
      beschreibung
      katasterNr
      status
      popStatusWerteByStatus {
        id
        text
      }
      statusUnklarGrund
      tpopApberrelevantGrundWerteByApberRelevantGrund {
        id
        text
      }
      apberRelevant
      apberRelevantGrund
      bekanntSeit
      eigentuemer
      kontakt
      nutzungszone
      bewirtschafter
      bewirtschaftung
      ekfrequenz
      ekfrequenzByEkfrequenz {
        id
        code
      }
      ekfrequenzAbweichend
      ekfrequenzStartjahr
      ekfKontrolleur
      adresseByEkfKontrolleur {
        id
        name
      }
      bemerkungen
      statusUnklar
      changedBy
    }
    allTpopHistories(filter: { id: { equalTo: $tpopId } }, orderBy: YEAR_DESC) {
      totalCount
      nodes {
        id
        year
        popId
        popByPopId {
          id
          label
        }
        nr
        gemeinde
        flurname
        geomPoint {
          geojson
          x
          y
        }
        radius
        hoehe
        exposition
        klima
        neigung
        beschreibung
        katasterNr
        status
        popStatusWerteByStatus {
          id
          text
        }
        statusUnklarGrund
        apberRelevant
        apberRelevantGrund
        tpopApberrelevantGrundWerteByApberRelevantGrund {
          id
          text
        }
        bekanntSeit
        eigentuemer
        kontakt
        nutzungszone
        bewirtschafter
        bewirtschaftung
        ekfrequenz
        ekfrequenzByEkfrequenz {
          id
          code
        }
        ekfrequenzAbweichend
        ekfrequenzStartjahr
        ekfKontrolleur
        adresseByEkfKontrolleur {
          id
          name
        }
        bemerkungen
        statusUnklar
        changedBy
      }
    }
    allPopStatusWertes(orderBy: CODE_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allTpopApberrelevantGrundWertes(
      orderBy: SORT_ASC
      filter: { code: { isNull: false } }
    ) {
      nodes {
        value: code
        label: text
      }
    }
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`

export const Component = () => {
  const { tpopId } = useParams()
  const apolloClient = useApolloClient()

  const { data, refetch } = useQuery<TpopHistoryQueryResult>({
    queryKey: ['tpopHistorien', tpopId],
    queryFn: async () => {
      const result = await apolloClient.query<TpopHistoryQueryResult>({
        query,
        variables: { tpopId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const [editingYear, setEditingYear] = useState<number | 'new' | null>(null)
  const [copyFrom, setCopyFrom] = useState<TpopHistoryItem | null>(null)
  const newFormRef = useRef<HTMLDivElement>(null)

  const row = data?.tpopById
  const rows = data?.allTpopHistories.nodes ?? []

  const options = {
    popStatusWertes: data?.allPopStatusWertes?.nodes ?? [],
    apberRelevantGrundWertes: data?.allTpopApberrelevantGrundWertes?.nodes ?? [],
    adresses: data?.allAdresses?.nodes ?? [],
    ekfrequenzs: data?.allEkfrequenzs?.nodes ?? [],
  }

  const handleAdd = () => {
    setCopyFrom(null)
    setEditingYear('new')
  }

  const handleCopy = (r: TpopHistoryItem) => {
    setCopyFrom(r)
    setEditingYear('new')
  }

  useEffect(() => {
    if (editingYear === 'new') {
      setTimeout(
        () => newFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
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
        title="Historien"
        MenuBarComponent={HistorienMenu}
        menuBarProps={{ onAdd: handleAdd }}
      />
      <div className={container}>
        <p className={docLine}>
          Jährlich historisierte Daten der Teil-Population (
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
                historyRow={r}
                options={options}
                onClose={() => setEditingYear(null)}
                refetch={refetch}
              />
            )
          }

          const dataArray = [
            {
              valueInRow: row?.popByPopId?.label ?? row?.popId,
              valueInHist: r?.popByPopId?.label ?? r?.popId,
              label: 'Population',
            },
            {
              valueInRow: row?.nr,
              valueInHist: r?.nr,
              label: 'Nr.',
            },
            {
              valueInRow: row?.flurname,
              valueInHist: r?.flurname,
              label: 'Flurname',
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
              valueInRow: row?.statusUnklarGrund,
              valueInHist: r?.statusUnklarGrund,
              label: 'Begründung (für Status unklar)',
            },
            {
              valueInRow: row?.apberRelevant,
              valueInHist: r?.apberRelevant,
              label: 'Für AP-Bericht relevant',
            },
            {
              valueInRow:
                row?.tpopApberrelevantGrundWerteByApberRelevantGrund?.text ??
                row?.apberRelevantGrund,
              valueInHist:
                r?.tpopApberrelevantGrundWerteByApberRelevantGrund?.text ??
                r?.apberRelevantGrund,
              label: 'Grund für AP-Bericht (Nicht-)Relevanz',
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
            {
              valueInRow: row?.gemeinde,
              valueInHist: r?.gemeinde,
              label: 'Gemeinde',
            },
            {
              valueInRow: row?.radius,
              valueInHist: r?.radius,
              label: 'Radius (m)',
            },
            {
              valueInRow: row?.hoehe,
              valueInHist: r?.hoehe,
              label: 'Höhe (m.ü.M.)',
            },
            {
              valueInRow: row?.exposition,
              valueInHist: r?.exposition,
              label: 'Exposition, Besonnung',
            },
            {
              valueInRow: row?.klima,
              valueInHist: r?.klima,
              label: 'Klima',
            },
            {
              valueInRow: row?.neigung,
              valueInHist: r?.neigung,
              label: 'Hangneigung',
            },
            {
              valueInRow: row?.beschreibung,
              valueInHist: r?.beschreibung,
              label: 'Beschreibung',
            },
            {
              valueInRow: row?.katasterNr,
              valueInHist: r?.katasterNr,
              label: 'Kataster-Nr.',
            },
            {
              valueInRow: row?.eigentuemer,
              valueInHist: r?.eigentuemer,
              label: 'EigentümerIn',
            },
            {
              valueInRow: row?.kontakt,
              valueInHist: r?.kontakt,
              label: 'Kontakt vor Ort',
            },
            {
              valueInRow: row?.nutzungszone,
              valueInHist: r?.nutzungszone,
              label: 'Nutzungszone',
            },
            {
              valueInRow: row?.bewirtschafter,
              valueInHist: r?.bewirtschafter,
              label: 'BewirtschafterIn',
            },
            {
              valueInRow: row?.bewirtschaftung,
              valueInHist: r?.bewirtschaftung,
              label: 'Bewirtschaftung',
            },
            {
              valueInRow: row?.bemerkungen,
              valueInHist: r?.bemerkungen,
              label: 'Bemerkungen',
            },
            {
              valueInRow: row?.ekfrequenzByEkfrequenz?.code ?? row?.ekfrequenz,
              valueInHist: r?.ekfrequenzByEkfrequenz?.code ?? r?.ekfrequenz,
              label: 'EK-Frequenz',
            },
            {
              valueInRow: row?.ekfrequenzAbweichend,
              valueInHist: r?.ekfrequenzAbweichend,
              label: 'EK-Frequenz abweichend',
            },
            {
              valueInRow: row?.ekfrequenzStartjahr,
              valueInHist: r?.ekfrequenzStartjahr,
              label: 'EK-Frequenz Startjahr',
            },
            {
              valueInRow:
                row?.adresseByEkfKontrolleur?.name ?? row?.ekfKontrolleur,
              valueInHist:
                r?.adresseByEkfKontrolleur?.name ?? r?.ekfKontrolleur,
              label: 'EKF-KontrolleurIn',
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
              <SharedHistory
                key={`${r.id}${r.year}`}
                year={r?.year}
                dataArray={dataArray}
              />
            </div>
          )
        })}
        {editingYear === 'new' && (
          <div ref={newFormRef}>
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
          </div>
        )}
      </div>
    </>
  )
}
