import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import SimpleBar from 'simplebar-react'
import { useQuery, gql } from '@apollo/client'
import { useParams } from 'react-router-dom'

import Spinner from '../../../shared/Spinner'
import History from '../../../shared/History'
import appBaseUrl from '../../../../modules/appBaseUrl'

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
  }
`

const InnerContainer = styled.div`
  padding: 8px 25px 0 25px;
  height: 100%;
  .slick-prev:before,
  .slick-next:before,
  .slick-dots li button:before {
    color: #4a148c;
  }
  .slick-prev {
    left: -20px;
  }
  .slick-next {
    right: -20px;
  }
  .slick-dots {
    bottom: -10px;
  }
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
`
const Aenderung = styled.span`
  background-color: rgba(216, 67, 21, 0.2);
`
const Aktuell = styled.span`
  background-color: rgb(201, 238, 211);
`

const ApHistory = () => {
  const { apId } = useParams()
  const { error, data, loading } = useQuery(apHistoriesQuery, {
    variables: {
      apId,
    },
  })

  const row = data?.apById
  const rows = data?.allApHistories.nodes ?? []

  const openDocs = useCallback(() => {
    const url = `${appBaseUrl()}/Dokumentation/historisierung`
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }, [])

  if (loading) {
    return <Spinner message="lade Historien" />
  }

  if (error) {
    return <ErrorContainer>{error.message}</ErrorContainer>
  }

  return (
    <SimpleBar style={{ maxHeight: '100%', height: '100%' }}>
      <InnerContainer>
        <DocLine>
          Jährlich historisierte Daten der Art (
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
            <History
              key={`${r.id}${r.year}`}
              year={r?.year}
              dataArray={dataArray}
            />
          )
        })}
      </InnerContainer>
    </SimpleBar>
  )
}

export default ApHistory
