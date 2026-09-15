import { useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useApolloClient } from '@apollo/client/react'
import { useAtomValue } from 'jotai'
import { SplitPane, Pane } from 'react-split-pane'

import { isPrintAtom, isEkfSinglePrintAtom } from '../../store/index.ts'


// when Karte was loaded async, it did not load,
// but only in production!
import { EkfList } from './List/index.tsx'
import { Component as Tpopfreiwkontr } from '../Projekte/Daten/Tpopfreiwkontr/index.tsx'
import { dataByUserId as dataByUserIdGql } from './dataByUserId.ts'
import { dataWithDateByUserId as dataWithDateByUserIdGql } from './dataWithDateByUserId.ts'
import { getEkfFromData, type EkfQueryResult } from './getEkfFromData.ts'

import styles from './index.module.css'

export const Component = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { userId, ekfId, ekfYear } = useParams()
  const isPrint = useAtomValue(isPrintAtom)
  const isEkfSinglePrint = useAtomValue(isEkfSinglePrintAtom)
  const apolloClient = useApolloClient()

  const ekfRefDate = new Date() //.setMonth(new Date().getMonth() - 2)
  const ekfRefYear = new Date(ekfRefDate).getFullYear()

  const query =
    ekfRefYear === +(ekfYear ?? 0) ? dataByUserIdGql : dataWithDateByUserIdGql

  const { data } = useSuspenseQuery({
    queryKey: ['ekf', userId, ekfYear],
    queryFn: async () => {
      const result = await apolloClient.query({
        query,
        variables: { id: userId, jahr: +(ekfYear ?? 0) },
      })
      if (result.error) throw result.error
      // the query document is built dynamically, so type the result by hand
      // errors are thrown above; an empty fallback renders the no-data notice
      return (result.data as EkfQueryResult | undefined) ?? { userById: null }
    },
  })

  const ekf = getEkfFromData({ data })

  useEffect(() => {
    // navigate to first kontrId so form is shown for first ekf
    // IF none is chosen yet
    if (ekf.length > 0 && !ekfId) {
      const firstEkf = ekf[0]
      if (firstEkf) {
        void navigate(`/Daten/Benutzer/${userId}/EKF/${ekfYear}/${firstEkf.id}${search}`)
      }
    }
    // adding ekf as dependency causes infinite loop
    // https://github.com/barbalex/apf2/issues/629
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ekfYear, ekfId, navigate, userId, search])

  if (ekf.length === 0) {
    return (
      <div className={styles.noDataContainer}>
        {`Für das Jahr ${ekfYear} existieren offenbar keine Erfolgskontrollen mit Ihnen als BearbeiterIn`}
      </div>
    )
  }

  if (isPrint && isEkfSinglePrint) {
    return <Tpopfreiwkontr id={ekfId} />
  }

  if (isPrint && ekf.length > 0) {
    return (
      <>
        {ekf.map((e) => (
          <Tpopfreiwkontr
            id={e.id}
            key={e.id}
          />
        ))}
      </>
    )
  }

  return (
    <div className={styles.container}>
      <SplitPane direction="horizontal">
        <Pane
          size="350px"
          minSize={100}
        >
          <EkfList ekf={ekf} />
        </Pane>
        {ekfId ?
          <Pane>
            <Tpopfreiwkontr id={ekfId} />
          </Pane>
        : <Pane>
            <div className={styles.innerContainer} />
          </Pane>
        }
      </SplitPane>
    </div>
  )
}
