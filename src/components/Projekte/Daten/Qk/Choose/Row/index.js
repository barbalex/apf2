import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import Checkbox from '@mui/material/Checkbox'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@apollo/client'

import query from './query'
import Error from '../../../../../shared/Error'

const Row = styled.div`
  display: flex;
  padding: 5px;
  border-bottom: 1px solid #e8e8e8;
  min-height: 52px;
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

const ChooseQkRow = ({ apId, qk, refetchTab }) => {
  const client = useApolloClient()

  const { data, error, refetch } = useQuery(query, {
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
      })
    }
    // 3. refetch data
    refetch()
    setTimeout(() => refetchTab())
  }, [apId, checked, client, qk.name, refetch, refetchTab])

  if (error) return <Error error={error} />
  return (
    <Row>
      <Check>
        <Checkbox checked={checked} onChange={onChange} color="primary" />
      </Check>
      <Titel>{qk.titel}</Titel>
      <Beschreibung>{qk.beschreibung}</Beschreibung>
    </Row>
  )
}

export default observer(ChooseQkRow)
