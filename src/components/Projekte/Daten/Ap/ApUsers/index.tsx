import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { ApUser } from './ApUser.tsx'
import { NewUser } from './NewUser.tsx'
import { Label } from '../../../../shared/Label.tsx'

import type { ApUserId } from '../../../../../models/apflora/ApUser.ts'

import styles from './index.module.css'

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
  const apolloClient = useApolloClient()

  const { apId } = useParams<{ apId: string }>()

  const { data, refetch } = useQuery({
    queryKey: ['apUsers', apId],
    queryFn: async () => {
      const result = await apolloClient.query<ApUsersQueryResult>({
        query: gql`
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
        variables: { apId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })
  const apUsers = data.allApUsers?.nodes ?? []

  return (
    <div className={styles.container}>
      <Label label={'Benutzer mit Zugriff'} />
      <div className={styles.newUserContainer}>
        {apUsers.length ?
          apUsers.map((user) => (
            <ApUser
              key={user.id}
              user={user}
              refetch={refetch}
            />
          ))
        : 'Es wurden noch keine Zugriffe erteilt'}
        <div className={styles.info}>
          <div>Zugriff hängt von der Rolle des Benutzers ab:</div>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              {
                '"ap_writer" haben Schreib-Rechte, wenn sie oben aufgelistet sind'
              }
            </div>
            <div className={styles.infoRow}>
              {'"ap_reader" haben Lese-Rechte, wenn sie oben aufgelistet sind'}
            </div>
          </div>
          <div>Darüber hinaus haben immer Zugriff:</div>
          <div className={styles.infoList}>
            <div className={styles.infoRow}>{'"manager" (Schreib-Rechte)'}</div>
            <div className={styles.infoRow}>{'"reader" (Lese-Rechte)'}</div>
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
