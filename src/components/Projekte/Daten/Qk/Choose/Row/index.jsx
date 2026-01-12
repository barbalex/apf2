import Checkbox from '@mui/material/Checkbox'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'
import { useQueryClient, useQuery } from '@tanstack/react-query'

import { query } from './query.js'
import { Error } from '../../../../../shared/Error.jsx'

import styles from './index.module.css'

export const Row = ({ apId, qk }) => {
  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const { data, error } = useQuery({
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
