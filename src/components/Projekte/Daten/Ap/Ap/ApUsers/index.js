import React from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import get from 'lodash/get'
import styled from 'styled-components'

import ApUser from './ApUser'
import NewUser from './NewUser'
import Label from '../../../../../shared/Label'

const Container = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
`
const NewUserContainer = styled.div`
  margin-bottom: 5px;
`
const Info = styled.div`
  margin-top: 1px;
  font-style: italic;
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.54);
`

const ApUsers = ({ apId }) => {
  const { data, error, loading, refetch } = useQuery(
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

  if (error) {
    return (
      <Container>
        <Label label={'Benutzer mit Zugriff'} />>{error.message}
      </Container>
    )
  }

  if (loading) {
    return (
      <Container>
        <Label label={'Benutzer mit Zugriff'} />
        lade Daten...
      </Container>
    )
  }

  return (
    <Container>
      <Label
        label={
          'Benutzer (mit Rolle "artverantwortlich" oder "art_reader") mit Zugriff'
        }
      />
      <NewUserContainer>
        {!!apUsers.length
          ? apUsers.map((user) => (
              <ApUser key={user.id} user={user} refetch={refetch} />
            ))
          : 'Es wurden noch keine Zugriffe erteilt'}
        <Info>{`Benutzer mit der Rolle "manager" oder "reader" haben immer Zugriff`}</Info>
      </NewUserContainer>
      <NewUser apId={apId} apUsers={apUsers} refetch={refetch} />
    </Container>
  )
}

export default observer(ApUsers)
