import { useState, type ChangeEvent } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { Select } from '../../../../shared/Select.tsx'

import type { ApId } from '../../../../../models/apflora/Ap.ts'

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
  apId: ApId
  apUsers: ApUser[]
  refetch: () => void
}

export const NewUser = ({ apId, apUsers, refetch }: NewUserProps) => {
  const apolloClient = useApolloClient()

  const [error, setError] = useState<string | null>(null)

  const { data } = useQuery({
    queryKey: ['benutzerForNewUser'],
    queryFn: async () => {
      const result = await apolloClient.query<BenutzerQueryResult>({
        query: gql`
          query benutzerForNewUser {
            allUsers(
              orderBy: NAME_ASC
              filter: {
                role: { in: ["apflora_ap_writer", "apflora_ap_reader"] }
              }
            ) {
              nodes {
                id
                name
                role
              }
            }
          }
        `,
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })
  const userData = data.allUsers.nodes ?? []
  const apUserIds = apUsers.map((u) => u?.userByUserName?.id)
  const options = userData
    .filter((d) => !apUserIds.includes(d.id))
    .map((d) => ({
      value: d.name ?? '(kein Name)',
      label: `${d.name ?? '(kein Name)'} (${d.role.replace('apflora_', '')})`,
    }))

  const saveToDb = async (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value
    try {
      await apolloClient.mutate<any>({
        mutation: gql`
          mutation createApUserForApMutation($apId: UUID!, $name: String) {
            createApUser(input: { apUser: { apId: $apId, userName: $name } }) {
              apUser {
                id
              }
            }
          }
        `,
        variables: { apId, name },
      })
    } catch (error) {
      return setError((error as Error).message)
    }
    refetch()
  }

  return (
    <Select
      key={apUsers.length}
      value={null}
      label="Neuem Benutzer Zugriff erteilen"
      name="neuerBenutzer"
      options={options}
      error={error}
      saveToDb={saveToDb}
    />
  )
}
