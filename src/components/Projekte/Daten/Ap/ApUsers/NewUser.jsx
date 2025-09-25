import { memo, useState, useCallback, useEffect } from 'react'
import { gql } from '@apollo/client'

import { useApolloClient, useQuery } from '@apollo/client/react'

import { Select } from '../../../../shared/Select.jsx'

export const NewUser = memo(({ apId, apUsers, refetch }) => {
  const apolloClient = useApolloClient()

  const [error, setError] = useState(null)

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(gql`
    query benutzerForNewUser {
      allUsers(
        orderBy: NAME_ASC
        filter: { role: { in: ["apflora_ap_writer", "apflora_ap_reader"] } }
      ) {
        nodes {
          id
          name
          role
        }
      }
    }
  `)
  const userData = data ? (data?.allUsers?.nodes ?? []) : []
  const apUserIds = apUsers.map((u) => u?.userByUserName?.id)
  const options = userData
    .filter((d) => !apUserIds.includes(d.id))
    .map((d) => ({
      value: d.name ?? '(kein Name)',
      label: `${d.name ?? '(kein Name)'} (${d.role.replace('apflora_', '')})`,
    }))

  const saveToDb = useCallback(
    async (event) => {
      const name = event.target.value
      try {
        await apolloClient.mutate({
          mutation: gql`
            mutation createApUserForApMutation($apId: UUID!, $name: String) {
              createApUser(
                input: { apUser: { apId: $apId, userName: $name } }
              ) {
                apUser {
                  id
                }
              }
            }
          `,
          variables: { apId, name },
        })
      } catch (error) {
        return setError(error.message)
      }
      refetch()
    },
    [apId, apolloClient, refetch],
  )

  useEffect(() => {
    if (queryError) setError(queryError.message)
  }, [queryError])

  return (
    <Select
      key={apUsers.length}
      value={null}
      label="Neuem Benutzer Zugriff erteilen"
      name="neuerBenutzer"
      options={options}
      loading={loading}
      error={error}
      saveToDb={saveToDb}
    />
  )
})
