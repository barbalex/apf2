import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { ApUser } from './ApUser.tsx'
import { NewUser } from './NewUser.tsx'
import { Label } from '../../../../shared/Label.jsx'
import { Error } from '../../../../shared/Error.tsx'

import type { ApUserId } from '../../../../../models/apflora/ApUser.js'

import {
  container,
  newUserContainer,
  info,
  infoList,
  infoRow,
} from './index.module.css'

interface ApUserNode {
  id: ApUserId
  userName: string
  userByUserName?: {
    id: string
    role: string
  }
}

interface ApUsersQueryResult {
  allApUsers: {
    nodes: ApUserNode[]
  }
}

export const ApUsers = () => {
  const { apId } = useParams<{ apId: string }>()

  const { data, error, loading, refetch } = useQuery<ApUsersQueryResult>(
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
      <div className={newUserContainer}>
        {apUsers.length ?
          apUsers.map((user) => (
            <ApUser
              key={user.id}
              user={user}
              refetch={refetch}
            />
          ))
        : 'Es wurden noch keine Zugriffe erteilt'}
        <div className={info}>
          <div>Zugriff hängt von der Rolle des Benutzers ab:</div>
          <div className={infoList}>
            <div className={infoRow}>
              {
                '"ap_writer" haben Schreib-Rechte, wenn sie oben aufgelistet sind'
              }
            </div>
            <div className={infoRow}>
              {'"ap_reader" haben Lese-Rechte, wenn sie oben aufgelistet sind'}
            </div>
          </div>
          <div>Darüber hinaus haben immer Zugriff:</div>
          <div className={infoList}>
            <div className={infoRow}>{'"manager" (Schreib-Rechte)'}</div>
            <div className={infoRow}>{'"reader" (Lese-Rechte)'}</div>
          </div>
          <div>
            {
              'Nur "manager" sehen die Rollen von Benutzern (Benutzer-Infos sind geschützt).'
            }
          </div>
        </div>
      </div>
      <NewUser
        apId={apId}
        apUsers={apUsers}
        refetch={refetch}
      />
    </div>
  )
}
