import { useState } from 'react'
import { graphql } from '../../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
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
  const apolloClient = useApolloClient()

  const [error, setError] = useState<string | null>(null)

  const { data } = useSuspenseQuery({
    queryKey: ['benutzerForNewUser'],
    queryFn: async () => {
      const result = await apolloClient.query<BenutzerQueryResult>({
        query: graphql(`
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
        `),
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as BenutzerQueryResult
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

  const saveToDb = async (event: {
    target: { name?: string; value: string | number | null }
  }) => {
    const name = event.target.value as string | null
    try {
      await apolloClient.mutate({
        mutation: graphql(`
          mutation createApUserForApMutation($apId: UUID!, $name: String) {
            createApUser(input: { apUser: { apId: $apId, userName: $name } }) {
              apUser {
                id
              }
            }
          }
        `),
        variables: { apId, name },
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
