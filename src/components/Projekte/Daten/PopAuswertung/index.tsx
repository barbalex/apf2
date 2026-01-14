import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { sortBy } from 'es-toolkit'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import CircularProgress from '@mui/material/CircularProgress'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import IconButton from '@mui/material/IconButton'
import MuiTooltip from '@mui/material/Tooltip'
import { useParams } from 'react-router'

import { query } from './query.ts'
import { CustomTooltip } from './CustomTooltip.tsx'
import { exists } from '../../../../modules/exists.js'
import { Error } from '../../../shared/Error.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

import type {
  PopId,
  TpopId,
  EkzaehleinheitId,
  TpopkontrzaehlEinheitWerteId,
  TpopStatusWerteCode,
} from '../../../../models/apflora/index.js'

import {
  spinnerContainer,
  spinnerText,
  noDataContainer,
  titleRow,
  title,
  container,
} from './index.module.css'

interface TpopData {
  id: TpopId
  nr: number | null
  label: string | null
  status: TpopStatusWerteCode | null
}

interface PopAuswertungQueryResult {
  popById?: {
    id: PopId
    label: string | null
  }
  popAuswTpopMenge?: {
    nodes: Array<{
      jahr: number | null
      values: string | null
    }>
  }
  allEkzaehleinheits?: {
    nodes: Array<{
      id: EkzaehleinheitId
      tpopkontrzaehlEinheitWerteByZaehleinheitId?: {
        id: TpopkontrzaehlEinheitWerteId
        text: string | null
      }
    }>
  }
  allTpops?: {
    nodes: TpopData[]
  }
}

const colorUrspruenglich = 'rgba(46,125,50,0.3)'
const colorAngesiedelt = 'rgba(245,141,66,1)'
const formatNumber = (tickItem) => {
  const value =
    exists(tickItem) && tickItem?.toLocaleString ?
      tickItem.toLocaleString('de-ch')
    : null
  return value
}

interface ComponentProps {
  height?: number
}

export const Component = ({ height = 400 }: ComponentProps) => {
  const { apId, popId } = useParams()

  const { data, error, loading } = useQuery<PopAuswertungQueryResult>(query, {
    variables: { apId, id: popId },
  })

  const popLabel = data?.popById?.label ?? 'Population'
  const tpopsData = data?.allTpops?.nodes ?? []
  const tpopMengeRawData = data?.popAuswTpopMenge?.nodes ?? []
  const tpopMengeData = tpopMengeRawData.map((e) => ({
    jahr: e.jahr,
    ...JSON.parse(e.values),
  }))
  const nonUniqueTpopIdsWithData = tpopMengeData.flatMap((d) =>
    Object.entries(d)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => key !== 'jahr')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => exists(value))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, value]) => key),
  )
  const tpopIdsWithData = [...new Set(nonUniqueTpopIdsWithData)]
  const tpopIdsWithDataSorted = sortBy(tpopIdsWithData, [
    (id) => {
      const tpop = tpopsData.find((d) => d.id === id)
      if (tpop) return tpop.nr
      return id
    },
  ])

  const zielEinheit =
    data?.allEkzaehleinheits?.nodes?.[0]
      ?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.text ?? '(keine Zielenheit)'

  const onClickMoreInfo = () => {
    const url = 'https://apflora.ch/Dokumentation/art-auswertung-pop-menge'
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  if (error) return <Error error={error} />

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  //console.log('AP, PopMenge, popMengeData:', popMengeData)

  return (
    <>
      <FormTitle title={`${popLabel}: Auswertung`} />
      <>
        {loading ?
          <div className={spinnerContainer}>
            <CircularProgress />
            <div className={spinnerText}>
              lade Mengen nach Teil-Populationen...
            </div>
          </div>
        : tpopMengeData.length ?
          <>
            <div className={titleRow}>
              <h4
                className={title}
              >{`"${zielEinheit}" nach Teil-Populationen`}</h4>
              <MuiTooltip title="Mehr Informationen">
                <IconButton
                  aria-label="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </MuiTooltip>
            </div>
            <ResponsiveContainer
              width="99%"
              height={height}
              className={container}
            >
              <AreaChart
                width={600}
                height={300}
                data={tpopMengeData}
                margin={{ top: 10, right: 10, left: 27 }}
              >
                <XAxis dataKey="jahr" />
                <YAxis
                  interval={0}
                  label={{
                    value: zielEinheit,
                    angle: -90,
                    position: 'insideLeft',
                    offset: -15,
                  }}
                  tickFormatter={formatNumber}
                />
                {tpopIdsWithDataSorted.reverse().map((id) => {
                  const tpop = tpopsData.find((p) => p.id === id)
                  let color
                  if (!tpop) {
                    color = 'grey'
                  } else {
                    const isUrspruenglich = tpop?.status < 200
                    color =
                      isUrspruenglich ? colorUrspruenglich : colorAngesiedelt
                  }

                  return (
                    <Area
                      key={id}
                      type="linear"
                      dataKey={id}
                      stackId="1"
                      stroke={color}
                      strokeWidth={2}
                      fill={color}
                      isAnimationActive={true}
                    />
                  )
                })}
                <Tooltip content={<CustomTooltip tpopsData={tpopsData} />} />
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </>
        : <>
            <div className={titleRow}>
              <h4
                className={title}
              >{`"${zielEinheit}" nach Teil-Populationen`}</h4>
              <MuiTooltip title="Mehr Informationen">
                <IconButton
                  aria-label="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </MuiTooltip>
            </div>
            <div className={noDataContainer}>Keine Daten gefunden</div>
          </>
        }
      </>
    </>
  )
}
