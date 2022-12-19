import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import SimpleBar from 'simplebar-react'
import { useQuery, gql } from '@apollo/client'

import Spinner from '../../../shared/Spinner'
import History from '../../../shared/History'
import appBaseUrl from '../../../../modules/appBaseUrl'

const popHistoriesQuery = gql`
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

const PopHistory = ({ popId }) => {
  const { error, data, loading } = useQuery(popHistoriesQuery, {
    variables: {
      popId,
    },
  })

  const row = data?.popById
  const rows = data?.allPopHistories.nodes ?? []

  const openDocs = useCallback(() => {
    const url = `${appBaseUrl()}/Dokumentation/historisierung`
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return window.open(url, '_blank', 'toolbar=no')
      }
      window.open(url)
    }
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
          Jährlich historisierte Daten der Population (
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

export default PopHistory
