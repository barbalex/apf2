import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
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
import { IoMdInformationCircleOutline } from 'react-icons/io'
import IconButton from '@mui/material/IconButton'
import MuiTooltip from '@mui/material/Tooltip'
import { useParams } from 'react-router'

import { query } from './query.ts'
import { CustomTooltip } from './CustomTooltip.tsx'
import { exists } from '../../../../modules/exists.ts'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type {
  PopId,
  TpopId,
  EkzaehleinheitId,
  TpopkontrzaehlEinheitWerteId,
} from '../../../../models/apflora/index.ts'

import styles from './index.module.css'

interface TpopData {
  id: TpopId
  nr: number | null
  label: string | null
  status: number | null
}

interface PopAuswertungQueryResult {
  popById?: {
    id: PopId
    label: string | null
  }
  popAuswTpopMenge?: {
    nodes: {
      jahr: number | null
      values: string
    }[]
  }
  allEkzaehleinheits?: {
    nodes: {
      id: EkzaehleinheitId
      tpopkontrzaehlEinheitWerteByZaehleinheitId?: {
        id: TpopkontrzaehlEinheitWerteId
        text: string | null
      }
    }[]
  }
  allTpops?: {
    nodes: TpopData[]
  }
}

const colorUrspruenglich = 'rgba(46,125,50,0.3)'
const colorAngesiedelt = 'rgba(245,141,66,1)'
const formatNumber = (tickItem: number) => {
  const value =
    exists(tickItem) && tickItem?.toLocaleString
      ? tickItem.toLocaleString('de-ch')
      : null
  return value
}

interface ComponentProps {
  height?: number
}

export const Component = ({ height = 400 }: ComponentProps) => {
  const { apId, popId } = useParams()
  const apolloClient = useApolloClient()

  const { data } = useSuspenseQuery({
    queryKey: ['popAuswertung', apId, popId],
    queryFn: async () => {
      const result = await apolloClient.query<PopAuswertungQueryResult>({
        query,
        variables: { apId, id: popId },
      })
      if (result.error) throw result.error
      return result.data as PopAuswertungQueryResult
    },
  })

  const popLabel = data?.popById?.label ?? 'Population'
  const tpopsData = data?.allTpops?.nodes ?? []
  const tpopMengeRawData = data?.popAuswTpopMenge?.nodes ?? []
  const tpopMengeData: Record<string, unknown>[] = tpopMengeRawData.map(
    (e) => ({
      jahr: e.jahr,
      ...JSON.parse(e.values),
    }),
  )
  const nonUniqueTpopIdsWithData = tpopMengeData.flatMap((d) =>
    Object.entries(d)
      .filter(([key]) => key !== 'jahr')
      .filter(([, value]) => exists(value))
      .map(([key]) => key),
  )
  const tpopIdsWithData = [...new Set(nonUniqueTpopIdsWithData)] as TpopId[]
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

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  return (
    <>
      <FormTitle title={`${popLabel}: Auswertung`} />
      {tpopMengeData.length ? (
        <>
          <div className={styles.titleRow}>
            <h4
              className={styles.title}
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
            className={styles.container as string}
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
                tickFormatter={formatNumber as (value: number) => string}
              />
              {tpopIdsWithDataSorted.reverse().map((id) => {
                const tpop = tpopsData.find((p) => p.id === id)
                let color: string
                if (!tpop) {
                  color = 'grey'
                } else {
                  const isUrspruenglich = (tpop?.status ?? 0) < 200
                  color = isUrspruenglich
                    ? colorUrspruenglich
                    : colorAngesiedelt
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
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <>
          <div className={styles.titleRow}>
            <h4
              className={styles.title}
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
          <div className={styles.noDataContainer}>Keine Daten gefunden</div>
        </>
      )}
    </>
  )
}
