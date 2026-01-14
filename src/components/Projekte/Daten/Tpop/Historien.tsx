import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { Spinner } from '../../../shared/Spinner.tsx'
import { History as SharedHistory } from '../../../shared/History/index.jsx'
import { appBaseUrl } from '../../../../modules/appBaseUrl.js'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

import type {
  TpopId,
  PopId,
  TpopStatusWerteCode,
  TpopApberrelevantGrundWerteCode,
  EkfrequenzId,
  AdresseId,
} from '../../../../generated/apflora/models.js'

import styles from './Historien.module.css'

interface TpopHistoryItem {
  id: TpopId
  year?: number | null
  popId: PopId
  popByPopId?: {
    id: PopId
    label?: string | null
  } | null
  nr?: number | null
  gemeinde?: number | null
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
  apberRelevant?: number | null
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
  tpopById?: TpopHistoryItem | null
  allTpopHistories: {
    totalCount: number
    nodes: TpopHistoryItem[]
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
  }
`

const simplebarStyle = { maxHeight: '100%', height: '100%' }

export const Component = () => {
  const { tpopId } = useParams()

  const { error, data, loading } = useQuery<TpopHistoryQueryResult>(query, {
    variables: {
      tpopId,
    },
  })

  const row = data?.tpopById
  const rows = data?.allTpopHistories.nodes ?? []

  const openDocs = () => {
    const url = `${appBaseUrl()}Dokumentation/historisierung`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  if (loading) return <Spinner />

  if (error) {
    return <div className={styles.errorContainer}>{error.message}</div>
  }

  return (
    <>
      <FormTitle title="Historien" />
      <div className={styles.container}>
        <p className={styles.docLine}>
          Jährlich historisierte Daten der Teil-Population (
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
            <SharedHistory
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
