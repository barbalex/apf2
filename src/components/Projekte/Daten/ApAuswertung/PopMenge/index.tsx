import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { sortBy } from 'es-toolkit'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import IconButton from '@mui/material/IconButton'
import MuiTooltip from '@mui/material/Tooltip'
import { useParams } from 'react-router'

import { query } from './query.ts'
import { CustomTooltip } from './CustomTooltip.tsx'
import { exists } from '../../../../../modules/exists.ts'

import type { ApId } from '../../../../../models/apflora/Ap.ts'
import type { PopId } from '../../../../../models/apflora/Pop.ts'
import type { EkzaehleinheitId } from '../../../../../models/apflora/Ekzaehleinheit.ts'
import type { TpopkontrzaehlEinheitWerteCode } from '../../../../../models/apflora/TpopkontrzaehlEinheitWerte.ts'
import type { PopStatusWerteCode } from '../../../../../models/apflora/PopStatusWerte.ts'

import styles from './index.module.css'

interface ApAuswPopMengeNode {
  jahr: number | null
  values: string | null
}

interface PopNode {
  id: PopId
  nr: number | null
  name: string | null
  status: PopStatusWerteCode | null
}

interface EkzaehleinheitNode {
  id: EkzaehleinheitId
  tpopkontrzaehlEinheitWerteByZaehleinheitId: {
    id: TpopkontrzaehlEinheitWerteCode
    text: string
  } | null
}

interface PopMengeQueryResult {
  apAuswPopMenge: {
    nodes: ApAuswPopMengeNode[]
  }
  allEkzaehleinheits: {
    nodes: EkzaehleinheitNode[]
  }
  allPops: {
    nodes: PopNode[]
  }
}

interface PopMengeProps {
  apId?: ApId
  height?: number
  print?: boolean
  isSubReport?: boolean
  jahr?: number
}

const colorUrspruenglich = 'rgba(46,125,50,0.3)'
const colorAngesiedelt = 'rgba(245,141,66,1)'
const formatNumber = (tickItem: any) => {
  const value =
    exists(tickItem) && tickItem?.toLocaleString ?
      tickItem.toLocaleString('de-ch')
    : null
  return value
}

export const PopMenge = ({
  apId: apIdPassed,
  height = 400,
  print,
  isSubReport,
  jahr: jahrPassed,
}: PopMengeProps) => {
  const apolloClient = useApolloClient()

  const { apId } = useParams<{ apId: string }>()
  const id = apIdPassed ?? (apId as ApId)

  const jahr = jahrPassed ?? new Date().getFullYear()
  const { data: dataPopMenge } = useQuery({
    queryKey: ['popMenge', id, jahr],
    queryFn: async () => {
      const result = await apolloClient.query<PopMengeQueryResult>({
        query,
        variables: { id, jahr },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const popsData = dataPopMenge.allPops.nodes ?? []
  const popMengeRawData = dataPopMenge.apAuswPopMenge.nodes ?? []
  const popMengeData = popMengeRawData.map((e) => ({
    jahr: e.jahr,
    ...JSON.parse(e.values),
  }))
  const nonUniquePopIdsWithData = popMengeData.flatMap((d) =>
    Object.entries(d)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => key !== 'jahr')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => exists(value))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([key, value]) => key),
  )
  const popIdsWithData = [...new Set(nonUniquePopIdsWithData)]
  const popIdsWithDataSorted = sortBy(popIdsWithData, [
    (id) => {
      const pop = popsData.find((d) => d.id === id)
      if (pop) return pop.nr
      return id
    },
  ])

  const zielEinheit =
    dataPopMenge.allEkzaehleinheits?.nodes?.[0]
      ?.tpopkontrzaehlEinheitWerteByZaehleinheitId?.text ?? '(keine Einheit)'

  const onClickMoreInfo = () => {
    const url = 'https://apflora.ch/Dokumentation/art-auswertung-pop-menge'
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return window.open(url, '_blank', 'toolbar=no')
    }
    window.open(url)
  }

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  //console.log('AP, PopMenge, popMengeData:', popMengeData)

  return (
    <>
      {popMengeData.length ?
        <>
          <div className={styles.titleRow}>
            <h4
              className={styles.title}
            >{`"${zielEinheit}" nach Populationen`}</h4>
            {!print && (
              <MuiTooltip title="Mehr Informationen">
                <IconButton
                  aria-label="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </MuiTooltip>
            )}
          </div>
          <ResponsiveContainer
            width="99%"
            height={height}
          >
            <AreaChart
              width={600}
              height={300}
              data={popMengeData}
              margin={{ top: 10, right: 10, left: 27 }}
            >
              <XAxis dataKey="jahr" />
              <YAxis
                interval={0}
                label={{
                  value: zielEinheit,
                  angle: -90,
                  position: 'insideLeft',
                  offset: print ? 0 : -15,
                }}
                tickFormatter={formatNumber}
              />
              {popIdsWithDataSorted.reverse().map((id) => {
                const pop = popsData.find((p) => p.id === id)
                let color
                if (!pop) {
                  color = 'grey'
                } else {
                  const isUrspruenglich = pop?.status < 200
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
                    isAnimationActive={!isSubReport}
                  />
                )
              })}
              {!isSubReport && (
                <Tooltip content={<CustomTooltip popsData={popsData} />} />
              )}
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      : <>
          <div className={styles.titleRow}>
            <h4
              className={styles.title}
            >{`"${zielEinheit}" nach Populationen`}</h4>
            {!print && (
              <MuiTooltip title="Mehr Informationen">
                <IconButton
                  aria-label="Mehr Informationen"
                  onClick={onClickMoreInfo}
                  size="large"
                >
                  <IoMdInformationCircleOutline />
                </IconButton>
              </MuiTooltip>
            )}
          </div>
          <div className={styles.noDataContainer}>Keine Daten gefunden</div>
        </>
      }
    </>
  )
}
