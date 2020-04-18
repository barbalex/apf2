import React from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import get from 'lodash/get'
import styled from 'styled-components'

import ApUser from './ApUser'

const Container = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`
const Title = styled.h4`
  margin-bottom: 5px;
`

const ApUsers = ({ apId }) => {
  const { data, error, loading } = useQuery(
    gql`
      query apUsersForApQuery($apId: UUID!) {
        allApUsers(
          filter: {
            apId: { equalTo: $apId }
            userByUserName: {
              role: { in: ["apflora_artverantwortlich", "apflora_art_reader"] }
            }
          }
        ) {
          nodes {
            id
            userName
            userByUserName {
              id
              role
            }
          }
        }
      }
    `,
    {
      variables: { apId },
    },
  )
  const apUsers = data ? get(data, 'allApUsers.nodes', []) : []
  console.log('ApUsers', { data, apUsers })

  if (error) {
    return (
      <Container>
        <Title>Benutzer mit Zugriff:</Title>
        {error.message}
      </Container>
    )
  }

  if (loading) {
    return (
      <Container>
        <Title>Benutzer mit Zugriff:</Title>
        lade Daten...
      </Container>
    )
  }

  return (
    <Container>
      <Title>Benutzer mit Zugriff:</Title>
      {apUsers.map((user) => (
        <ApUser user={user} />
      ))}
    </Container>
  )
}

export default observer(ApUsers)
