import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Tooltip,
} from 'recharts'
import { useParams } from 'react-router'

import { query } from './query.ts'
import { CustomTooltip } from '../CustomTooltip.tsx'

import type { ApId } from '../../../../../models/apflora/Ap.ts'

import styles from './index.module.css'

interface TpopKontrolliertNode {
  year: number | null
  anzTpop: string | null
  anzTpopber: string | null
}

interface TpopKontrolliertQueryResult {
  tpopKontrolliertForJber: {
    nodes: TpopKontrolliertNode[]
  }
}

interface TpopKontrolliertProps {
  apId?: ApId
  height?: number
  print?: boolean
  isSubReport?: boolean
  jahr?: number
}

const color = {
  'Teil-Populationen': '#2e7d32',
  kontrolliert: 'red',
}

export const TpopKontrolliert = ({
  apId: apIdPassed,
  height = 400,
  print,
  isSubReport,
  jahr,
}: TpopKontrolliertProps) => {
  const apolloClient = useApolloClient()

  const { apId } = useParams<{ apId: string }>()
  const id = apIdPassed ?? (apId as ApId)

  const { data } = useQuery({
    queryKey: ['tpopKontrolliert', id, jahr ?? new Date().getFullYear()],
    queryFn: async () => {
      const result = await apolloClient.query<TpopKontrolliertQueryResult>({
        query,
        variables: { id, year: jahr ?? new Date().getFullYear() },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })
  const erfolgData = data.tpopKontrolliertForJber.nodes.map((d) => ({
    jahr: d.year,
    'Teil-Populationen': d.anzTpop ? Number(d.anzTpop) : 0,
    kontrolliert: d.anzTpopber ? Number(d.anzTpopber) : 0,
  }))

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  return (
    <>
      {erfolgData.length ?
        <>
          <h4 className={styles.title}>
            (<span className={styles.titleKontr}>kontrollierte</span>){' '}
            <span className={styles.titleTitle}>Teil-Populationen</span>
          </h4>
          <ResponsiveContainer
            width="99%"
            height={height}
          >
            <LineChart
              width={600}
              height={300}
              data={erfolgData}
              margin={{ top: 10, right: 10, left: 27 }}
            >
              <XAxis dataKey="jahr" />
              <YAxis
                label={{
                  value: print ? 'Anzahl' : 'Teil-Populationen',
                  angle: -90,
                  position: 'insideLeft',
                  offset: print ? 0 : -15,
                }}
                dataKey="Teil-Populationen"
              />
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />
              <Line
                type="linear"
                dataKey="Teil-Populationen"
                stroke="#2e7d32"
                strokeWidth={1}
                isAnimationActive={!isSubReport}
                dot={{ strokeWidth: 2, r: 4 }}
                fill="rgba(255,253,231,0)"
              />
              <Line
                type="linear"
                dataKey="kontrolliert"
                stroke="red"
                strokeWidth={1}
                isAnimationActive={!isSubReport}
                dot={{ strokeWidth: 2, r: 4 }}
                fill="rgba(255,253,231,0)"
              />
              <Legend
                layout="horizontal"
                align="center"
                iconSize={22}
              />
              {!isSubReport && (
                <Tooltip
                  content={
                    <CustomTooltip
                      color={color}
                      reverse={true}
                    />
                  }
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </>
      : <>
          <h4 className={styles.title}>
            (<span className={styles.titleKontr}>kontrollierte</span>){' '}
            <span className={styles.titleTitle}>Teil-Populationen</span>
          </h4>
          <div className={styles.noDataContainer}>Keine Daten gefunden</div>
        </>
      }
    </>
  )
}
