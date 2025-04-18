import { useCallback } from 'react'
import styled from '@emotion/styled'
import { useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router'

import { Spinner } from '../../../shared/Spinner.jsx'
import { History as SharedHistory } from '../../../shared/History/index.jsx'
import { appBaseUrl } from '../../../../modules/appBaseUrl.js'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
  height: 100%;
`
const ErrorContainer = styled.div`
  padding: 25px;
`
const DocLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
`
const DocLine = styled.p`
  margin-bottom: 0;
  &:first-of-type {
    margin-top: 0;
  }
`
const Aenderung = styled.span`
  background-color: rgba(216, 67, 21, 0.2);
`
const Aktuell = styled.span`
  background-color: rgb(201, 238, 211);
`
const simplebarStyle = { maxHeight: '100%', height: '100%' }

export const Component = () => {
  const { tpopId } = useParams()

  const { error, data, loading } = useQuery(query, {
    variables: {
      tpopId,
    },
  })

  const row = data?.tpopById
  const rows = data?.allTpopHistories.nodes ?? []

  const openDocs = useCallback(() => {
    const url = `${appBaseUrl()}/Dokumentation/historisierung`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [])

  if (loading) return <Spinner />

  if (error) {
    return <ErrorContainer>{error.message}</ErrorContainer>
  }

  return (
    <>
      <FormTitle title="Historien" />
      <Container>
        <DocLine>
          Jährlich historisierte Daten der Teil-Population (
          <DocLink onClick={openDocs}>Dokumentation</DocLink>
          ).
        </DocLine>
        <DocLine>
          <Aenderung>Änderungen</Aenderung> zum{' '}
          <Aktuell>aktuellen Zustand</Aktuell> sind hervorgehoben.
        </DocLine>
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
      </Container>
    </>
  )
}
