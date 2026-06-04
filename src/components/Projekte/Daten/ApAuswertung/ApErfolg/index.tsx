import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { range } from 'es-toolkit'
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { useParams } from 'react-router'

import { query } from './query.ts'
import { CustomTick } from './CustomTick.tsx'

import type { ApberId } from '../../../../../models/apflora/Apber.ts'
import type { ApErfkritWerteCode } from '../../../../../models/apflora/ApErfkritWerte.ts'

import styles from './index.module.css'

interface ApberNode {
  id: ApberId
  jahr: number | null
  beurteilung: ApErfkritWerteCode | null
  apErfkritWerteByBeurteilung: {
    id: number
    text: string
  } | null
}

interface ApErfolgQueryResult {
  allApbers: {
    nodes: ApberNode[]
  }
}

const erfValueFromCode = {
  3: 1, // nicht erfolgreich
  6: 2, // wenig erfolgreich
  5: 3, // mässig erfolgreich
  1: 4, // erfolgreich
  4: 5, // sehr erfolgreich
}

interface FindErfolgProps {
  jahr: number
  erfolgRawData: Array<{
    jahr: number
    value: number | null
  }>
}
const findErfolg = ({ jahr, erfolgRawData }: FindErfolgProps) =>
  erfolgRawData.find((e) => e.jahr === jahr)

const makeErfolg = (jahr: number) => ({ jahr, value: null })

const getErfolg = ({ jahr, erfolgRawData }: FindErfolgProps) =>
  findErfolg({ jahr, erfolgRawData }) || makeErfolg(jahr)

const addMissingErfolgData = (
  erfolgRawData: FindErfolgProps['erfolgRawData'],
) => {
  const years = erfolgRawData.map((e) => e.jahr)
  const allYears = range(Math.min(...years), Math.max(...years) + 1)
  return allYears.map((jahr) => getErfolg({ jahr, erfolgRawData }))
}

export const ApErfolg = () => {
  const apolloClient = useApolloClient()

  const { apId: id } = useParams<{ apId: string }>()

  const { data: dataErfolg } = useQuery({
    queryKey: ['apErfolg', id],
    queryFn: async () => {
      const result = await apolloClient.query<ApErfolgQueryResult>({
        query,
        variables: { id },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })
  const erfolgRawData = dataErfolg.allApbers.nodes.map((e) => ({
    jahr: e.jahr,
    value: erfValueFromCode[e.beurteilung],
  }))
  const erfolgData = addMissingErfolgData(erfolgRawData)

  // need to disable animation on lines or labels will not show on first render
  // https://github.com/recharts/recharts/issues/1821

  //console.log('AP Erfolg, erfolgData:', erfolgData)

  return (
    <>
      {erfolgRawData.length ?
        <>
          <h4 className={styles.title}>Erfolg des Aktionsplans</h4>
          <ResponsiveContainer
            width="99%"
            height={400}
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
                  value: 'Erfolg',
                  angle: -90,
                  position: 'insideLeft',
                  offset: -15,
                }}
                dataKey="value"
                domain={[0, 5]}
                tick={<CustomTick />}
                interval={0}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2e7d32"
                strokeWidth={1}
                isAnimationActive={true}
                dot={{ strokeWidth: 2, r: 4 }}
                fill="rgba(255,253,231,0)"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      : <>
          <h4 className={styles.title}>Erfolg des Aktionsplans</h4>
          <div className={styles.noDataContainer}>Keine Daten gefunden</div>
        </>
      }
    </>
  )
}
