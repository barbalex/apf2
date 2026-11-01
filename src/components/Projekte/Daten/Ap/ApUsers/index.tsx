import { apiFetch } from '../../../../../modules/api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
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
  const { apId } = useParams<{ apId: string }>()

  const { data, refetch } = useSuspenseQuery({
    queryKey: ['apUsers', apId],
    queryFn: async () => {
      // phase 5: the old userByUserName relation embeds through the
      // ap_user_user_name_fkey FK (PostgREST names it after the target table)
      const nodes = await apiFetch<ApUserNode[]>(
        `/ap_user?ap_id=eq.${apId ?? ''}&select=id,userName:user_name,userByUserName:user(id,role)&order=user_name.asc`,
      )
      return { allApUsers: { nodes: nodes ?? [] } } as ApUsersQueryResult
    },
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
        apId={apId ?? ''}
        apUsers={apUsers}
        refetch={refetch}
      />
    </div>
  )
}
