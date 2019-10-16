import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Checkbox from '@material-ui/core/Checkbox'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import get from 'lodash/get'

import query from './query'

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
  const apqk = get(data, 'apqkByApIdAndQkName')

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

  if (error)
    return (
      <Row>
        <Check>Fehler</Check>
        <Titel>{qk.titel}</Titel>
        <Beschreibung>{qk.beschreibung}</Beschreibung>
      </Row>
    )
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
