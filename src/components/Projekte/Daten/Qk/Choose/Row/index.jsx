import { memo, useCallback } from 'react'
import styled from '@emotion/styled'
import Checkbox from '@mui/material/Checkbox'
import { useApolloClient, useQuery, gql } from '@apollo/client'

import { query } from './query.js'
import { Error } from '../../../../../shared/Error.jsx'

const RowDiv = styled.div`
  display: flex;
  padding: 5px;
  border-bottom: 1px solid #e8e8e8;
`
const Check = styled.div`
  padding: 0 5px;
`
const Titel = styled.div`
  padding: 0 5px;
  display: flex;
  align-items: center;
`
const Beschreibung = styled.div`
  padding: 0 5px;
  display: flex;
  align-items: center;
`

export const Row = memo(({ apId, qk }) => {
  const client = useApolloClient()

  const { data, error } = useQuery(query, {
    variables: { apId, qkName: qk.name },
  })
  const apqk = data?.apqkByApIdAndQkName

  const checked = !!apqk

  const onChange = useCallback(async () => {
    // 1. if checked, delete apqk
    // 2. else create apqk
    const variables = { apId, qkName: qk.name }
    if (checked) {
      await client.mutate({
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
      await client.mutate({
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
        refetchQueries: ['QkQueryForQkTopRouter'],
      })
    }
    // 3. refetch data
    setTimeout(() =>
      client.refetchQueries({
        include: ['QkQueryForQkTopRouter', 'apqkQueryForRow'],
      }),
    )
  }, [apId, checked, client, qk.name])

  if (error) return <Error error={error} />
  return (
    <RowDiv>
      <Check>
        <Checkbox
          checked={checked}
          onChange={onChange}
          color="primary"
        />
      </Check>
      <Titel>{qk.titel}</Titel>
      <Beschreibung>{qk.beschreibung}</Beschreibung>
    </RowDiv>
  )
})
