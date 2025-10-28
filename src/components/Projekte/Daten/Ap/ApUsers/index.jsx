import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import styled from '@emotion/styled'
import { useParams } from 'react-router'

import { ApUser } from './ApUser.jsx'
import { NewUser } from './NewUser.jsx'
import { Label } from '../../../../shared/Label.jsx'
import { Error } from '../../../../shared/Error.jsx'

import { container } from './index.module.css'

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
const InfoList = styled.ul`
  margin-bottom: 5px;
`
const InfoRow = styled.li`
  margin-bottom: 0;
`

export const ApUsers = () => {
  const { apId } = useParams()

  const { data, error, loading, refetch } = useQuery(
    gql`
      query apUsersForApQuery($apId: UUID!) {
        allApUsers(
          filter: {
            apId: { equalTo: $apId }
            # uncommented because ap_writer's dont see other names otherwise
            # userByUserName: {
            #   role: { in: ["apflora_ap_writer", "apflora_ap_reader"] }
            # }
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
  const apUsers = data ? (data?.allApUsers?.nodes ?? []) : []

  if (loading) {
    return (
      <div className={container}>
        <Label label={'Benutzer mit Zugriff'} />
        lade Daten...
      </div>
    )
  }

  if (error) return <Error error={error} />

  return (
    <div className={container}>
      <Label label={'Benutzer mit Zugriff'} />
      <NewUserContainer>
        {apUsers.length ?
          apUsers.map((user) => (
            <ApUser
              key={user.id}
              user={user}
              refetch={refetch}
            />
          ))
        : 'Es wurden noch keine Zugriffe erteilt'}
        <Info>
          <div>Zugriff hängt von der Rolle des Benutzers ab:</div>
          <InfoList>
            <InfoRow>
              {
                '"ap_writer" haben Schreib-Rechte, wenn sie oben aufgelistet sind'
              }
            </InfoRow>
            <InfoRow>
              {'"ap_reader" haben Lese-Rechte, wenn sie oben aufgelistet sind'}
            </InfoRow>
          </InfoList>
          <div>Darüber hinaus haben immer Zugriff:</div>
          <InfoList>
            <InfoRow>{'"manager" (Schreib-Rechte)'}</InfoRow>
            <InfoRow>{'"reader" (Lese-Rechte)'}</InfoRow>
          </InfoList>
          <div>
            {
              'Nur "manager" sehen die Rollen von Benutzern (Benutzer-Infos sind geschützt).'
            }
          </div>
        </Info>
      </NewUserContainer>
      <NewUser
        apId={apId}
        apUsers={apUsers}
        refetch={refetch}
      />
    </div>
  )
}
