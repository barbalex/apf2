import React from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery, gql } from '@apollo/client'
import get from 'lodash/get'
import styled from 'styled-components'

import ApUser from './ApUser'
import NewUser from './NewUser'
import Label from '../../../../../shared/Label'

const Container = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  border: 1px rgba(46, 125, 50, 0.4) solid;
  padding: 0 10px;
`
const NewUserContainer = styled.div`
  margin-bottom: 5px;
`
const Info = styled.div`
  margin-top: 7px;
  margin-bottom: 12px;
  font-style: italic;
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.54);
`
const InfoTitle = styled.div``
const InfoList = styled.ul`
  margin-bottom: 5px;
`
const InfoRow = styled.li`
  margin-bottom: 0;
`

const ApUsers = ({ apId }) => {
  const { data, error, loading, refetch } = useQuery(
    gql`
      query apUsersForApQuery($apId: UUID!) {
        allApUsers(
          filter: {
            apId: { equalTo: $apId }
            userByUserName: {
              role: { in: ["apflora_ap_writer", "apflora_ap_reader"] }
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
      <Label label={'Benutzer mit Zugriff'} />
      <NewUserContainer>
        {!!apUsers.length
          ? apUsers.map((user) => (
              <ApUser key={user.id} user={user} refetch={refetch} />
            ))
          : 'Es wurden noch keine Zugriffe erteilt'}
        <Info>
          <InfoTitle>Zugriff hängt von der Rolle des Benutzers ab:</InfoTitle>
          <InfoList>
            <InfoRow>
              "ap_writer" haben Schreib-Rechte, wenn sie oben aufgelistet sind
            </InfoRow>
            <InfoRow>
              "ap_reader" haben Lese-Rechte, wenn sie oben aufgelistet sind
            </InfoRow>
          </InfoList>
          <InfoTitle>Darüber hinaus haben immer Zugriff:</InfoTitle>
          <InfoList>
            <InfoRow>"manager" (Schreib-Rechte)</InfoRow>
            <InfoRow>"reader" (Lese-Rechte)</InfoRow>
          </InfoList>
        </Info>
      </NewUserContainer>
      <NewUser apId={apId} apUsers={apUsers} refetch={refetch} />
    </Container>
  )
}

export default observer(ApUsers)
