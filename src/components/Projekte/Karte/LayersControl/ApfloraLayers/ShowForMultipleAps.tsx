import { useParams } from 'react-router'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { Checkbox } from '../shared/Checkbox.tsx'
import {
  mapShowApfLayersForMultipleApsAtom,
  setMapShowApfLayersForMultipleApsAtom,
  treeApGqlFilterForTreeAtom,
} from '../../../../../store/index.ts'

interface ShowForMultipleApsQueryResult {
  allAps: {
    totalCount: number
  }
}

import styles from './ShowForMultipleAps.module.css'

export const ShowForMultipleAps = () => {
  const { apId } = useParams()

  const showApfLayersForMultipleAps = useAtomValue(
    mapShowApfLayersForMultipleApsAtom,
  )
  const setShowApfLayersForMultipleAps = useSetAtom(
    setMapShowApfLayersForMultipleApsAtom,
  )
  const apGqlFilterForTree = useAtomValue(treeApGqlFilterForTreeAtom)

  const apolloClient = useApolloClient()
  const { data } = useQuery({
    queryKey: ['apsCount', apGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query<ShowForMultipleApsQueryResult>({
        query: gql`
          query LayersControlLayersQuery($apsFilter: ApFilter!) {
            allAps(filter: $apsFilter) {
              totalCount
            }
          }
        `,
        variables: {
          apsFilter: apGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
  })

  const apsCount = data?.allAps?.totalCount ?? 0

  const comment = apsCount > 1 ? `${apsCount} Arten aktiv.` : ''
  const color =
    apsCount > 5 ? 'rgba(228, 89, 0, 1)'
    : apsCount > 50 ? 'rgba(228, 0, 0, 1)'
    : ''

  return (
    <div className={styles.layer}>
      <Checkbox
        value={showApfLayersForMultipleAps}
        label="Layer auch anzeigen, wenn mehr als eine Art aktiv ist"
        checked={showApfLayersForMultipleAps}
        onChange={() =>
          setShowApfLayersForMultipleAps(!showApfLayersForMultipleAps)
        }
      />
      {!apId && showApfLayersForMultipleAps && (
        <>
          <div className={styles.comments}>
            <span style={{ fontWeight: 700, color: color ?? 'inherit' }}>
              {comment}
            </span>
            <span className={styles.comment2}>
              Je mehr, desto langsamer wird die App
            </span>
          </div>
        </>
      )}
    </div>
  )
}
