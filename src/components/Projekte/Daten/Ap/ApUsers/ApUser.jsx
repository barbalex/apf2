import { useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import styled from '@emotion/styled'
import { useApolloClient, gql } from '@apollo/client'

import { StoreContext } from '../../../../../storeContext.js'

const DelIcon = styled(IconButton)`
  font-size: 1rem !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
`

export const ApUser = observer(({ user, refetch }) => {
  const client = useApolloClient()
  const { enqueNotification } = useContext(StoreContext)

  const onClickDelete = useCallback(async () => {
    try {
      await client.mutate({
        mutation: gql`
          mutation deleteApUserForApMutation($id: UUID!) {
            deleteApUserById(input: { id: $id }) {
              clientMutationId
            }
          }
        `,
        variables: { id: user.id },
      })
    } catch (error) {
      enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    refetch()
  }, [client, enqueNotification, refetch, user.id])

  const role = (user?.userByUserName?.role ?? '').replace('apflora_', '')

  // non-managers do not see role, so don't show it if there is none
  return (
    <div>
      {user.userName}
      {!!role && <span>{` (${role})`}</span>}
      <DelIcon
        title={`${user.userName} entfernen`}
        aria-label={`${user.userName} entfernen`}
        onClick={onClickDelete}
      >
        <FaTimes />
      </DelIcon>
    </div>
  )
})