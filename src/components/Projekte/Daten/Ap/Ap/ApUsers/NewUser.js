import React, { useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery, useApolloClient, gql } from '@apollo/client'

import Select from '../../../../../shared/Select'

const NewUser = ({ apId, apUsers, refetch }) => {
  const client = useApolloClient()

  const [error, setError] = useState(null)

  const {
    data,
    loading,
    error: queryError,
  } = useQuery(
    gql`
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
    `,
  )
  const userData = data ? data?.allUsers?.nodes ?? [] : []
  const apUserIds = apUsers.map((u) => u?.userByUserName?.id)
  const options = userData
    .filter((d) => !apUserIds.includes(d.id))
    .map((d) => ({
      value: d.name,
      label: `${d.name} (${d.role.replace('apflora_', '')})`,
    }))

  const saveToDb = useCallback(
    async (event) => {
      const name = event.target.value
      try {
        await client.mutate({
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
    [apId, client, refetch],
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
}

export default observer(NewUser)
