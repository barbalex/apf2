import Checkbox from '@mui/material/Checkbox'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'
import { useQueryClient, useQuery } from '@tanstack/react-query'

import { query } from './query.ts'
import { Error } from '../../../../../shared/Error.jsx'

import type {
  ApId,
  QkName,
  ApqkQkName,
} from '../../../../../../models/apflora/index.js'

import styles from './index.module.css'

interface QkNode {
  name: QkName
  titel: string | null
  beschreibung: string | null
}

interface ApqkData {
  apId: ApId
  qkName: ApqkQkName
}

interface ApqkQueryResult {
  data?: {
    apqkByApIdAndQkName?: ApqkData
  }
}

interface RowProps {
  apId: ApId
  qk: QkNode
}

export const Row = ({ apId, qk }: RowProps) => {
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const { data, error } = useQuery<ApqkQueryResult>({
    queryKey: ['apqkQueryForRow', apId, qk.name],
    queryFn: async () =>
      apolloClient.query({
        query: query,
        variables: { apId, qkName: qk.name },
        fetchPolicy: 'no-cache',
      }),
  })
  const apqk = data?.data?.apqkByApIdAndQkName

  const checked = !!apqk

  const onChange = async () => {
    // 1. if checked, delete apqk
    // 2. else create apqk
    const variables = { apId, qkName: qk.name }
    if (checked) {
      await apolloClient.mutate({
        mutation: gql`
          mutation deleteApqk($apId: UUID!, $qkName: String!) {
            deleteApqkByApIdAndQkName(input: { apId: $apId, qkName: $qkName }) {
              deletedApqkId
            }
          }
        `,
        variables,
      })
    } else {
      await apolloClient.mutate({
        mutation: gql`
          mutation createApqk($apId: UUID!, $qkName: String!) {
            createApqk(input: { apqk: { apId: $apId, qkName: $qkName } }) {
              apqk {
                apId
                qkName
              }
            }
          }
        `,
        variables,
      })
    }
    // 3. refetch data
    tsQueryClient.invalidateQueries({
      queryKey: ['treeAp'],
    })
    setTimeout(() =>
      tsQueryClient.invalidateQueries({
        queryKey: [`apqkQueryForRow`],
      }),
    )
  }

  if (error) return <Error error={error} />

  return (
    <div className={styles.container}>
      <div className={styles.check}>
        <Checkbox
          checked={checked}
          onChange={onChange}
          color="primary"
        />
      </div>
      <div className={styles.titel}>{qk.titel}</div>
      <div className={styles.beschreibung}>{qk.beschreibung}</div>
    </div>
  )
}
