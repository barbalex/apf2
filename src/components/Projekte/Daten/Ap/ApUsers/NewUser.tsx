import { apiFetch, apiInsert } from '../../../../../modules/api.ts'
import { v7 as uuidv7 } from 'uuid'
import type { SaveToDbEvent } from '../../../../shared/types.ts'
import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'

import { Select } from '../../../../shared/Select.tsx'

interface ApUser {
  userByUserName?: {
    id: string
  }
}

interface UserNode {
  id: string
  name: string | null
  role: string
}

interface BenutzerQueryResult {
  allUsers: {
    nodes: UserNode[]
  }
}

interface NewUserProps {
  apId: string
  apUsers: ApUser[]
  refetch: () => Promise<unknown>
}

export const NewUser = ({ apId, apUsers, refetch }: NewUserProps) => {
  const [error, setError] = useState<string | null>(null)

  const { data } = useSuspenseQuery({
    queryKey: ['benutzerForNewUser'],
    queryFn: async () => {
      const nodes = await apiFetch<UserNode[]>(
        `/user?select=id,name,role&role=in.(apflora_ap_writer,apflora_ap_reader)&order=name.asc`,
      )
      return { allUsers: { nodes: nodes ?? [] } } as BenutzerQueryResult
    },
  })
  const userData = data.allUsers.nodes ?? []
  const apUserIds = apUsers.map((u) => u?.userByUserName?.id)
  const options = userData
    .filter((d) => !apUserIds.includes(d.id))
    .map((d) => ({
      value: d.name ?? '(kein Name)',
      label: `${d.name ?? '(kein Name)'} (${d.role.replace('apflora_', '')})`,
    }))

  const saveToDb = async (event: SaveToDbEvent) => {
    const name = event.target.value as string | null
    try {
      await apiInsert('ap_user', {
        id: uuidv7(),
        ap_id: apId,
        user_name: name,
      })
    } catch (error) {
      return setError((error as Error).message)
    }
    void refetch()
  }

  return (
    <Select
      key={apUsers.length}
      value={null}
      label="Neuem Benutzer Zugriff erteilen"
      name="neuerBenutzer"
      options={options}
      error={error ?? ''}
      saveToDb={(event) => void saveToDb(event)}
    />
  )
}
