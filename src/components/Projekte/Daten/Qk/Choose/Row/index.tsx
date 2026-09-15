import Checkbox from '@mui/material/Checkbox'
import { graphql } from '../../../../../../gql/index.ts'

import { useApolloClient } from '@apollo/client/react'
import { useQueryClient, useQuery } from '@tanstack/react-query'

import { query } from './query.ts'
import { Error } from '../../../../../shared/Error.tsx'

import type {
  ApId,
  QkName,
  ApqkQkName,
} from '../../../../../../models/apflora/index.ts'

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
  apqkByApIdAndQkName?: ApqkData | null
}

interface RowProps {
  apId: ApId
  qk: QkNode
  refetchTab?: (() => void) | undefined
}

export const Row = ({ apId, qk }: RowProps) => {
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const { data, error } = useQuery({
    queryKey: ['apqkQueryForRow', apId, qk.name],
    queryFn: async () => {
      const result = await apolloClient.query<ApqkQueryResult>({
        query: query,
        variables: { apId, qkName: qk.name },
      })
      if (result.error) throw result.error
      return result.data
    },
  })
  const apqk = data?.apqkByApIdAndQkName

  const checked = !!apqk

  const onChange = async () => {
    // 1. if checked, delete apqk
    // 2. else create apqk
    const variables = { apId, qkName: qk.name }
    if (checked) {
      await apolloClient.mutate({
        mutation: graphql(`
          mutation deleteApqk($apId: UUID!, $qkName: String!) {
            deleteApqkByApIdAndQkName(input: { apId: $apId, qkName: $qkName }) {
              deletedApqkId
            }
          }
        `),
        variables,
      })
    } else {
      await apolloClient.mutate({
        mutation: graphql(`
          mutation createApqk($apId: UUID!, $qkName: String!) {
            createApqk(input: { apqk: { apId: $apId, qkName: $qkName } }) {
              apqk {
                apId
                qkName
              }
            }
          }
        `),
        variables,
      })
    }
    // 3. refetch data
    void tsQueryClient.invalidateQueries({
      queryKey: ['treeAp'],
    })
    setTimeout(() => {
      void tsQueryClient.invalidateQueries({
        queryKey: [`apqkQueryForRow`],
      })
    })
  }

  if (error) return <Error error={error} />

  return (
    <div className={styles.container}>
      <div className={styles.check}>
        <Checkbox
          checked={checked}
          onChange={() => void onChange()}
          color="primary"
        />
      </div>
      <div className={styles.titel}>{qk.titel}</div>
      <div className={styles.beschreibung}>{qk.beschreibung}</div>
    </div>
  )
}
