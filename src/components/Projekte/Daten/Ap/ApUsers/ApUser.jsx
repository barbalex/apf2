import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import { MobxContext } from '../../../../../mobxContext.js'
import { delIcon } from './ApUser.module.css'

export const ApUser = observer(({ user, refetch }) => {
  const apolloClient = useApolloClient()
  const { enqueNotification } = useContext(MobxContext)

  const onClickDelete = async () => {
    try {
      await apolloClient.mutate({
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
        options: { variant: 'error' },
      })
    }
    refetch()
  }

  const role = (user?.userByUserName?.role ?? '').replace('apflora_', '')

  // non-managers do not see role, so don't show it if there is none
  return (
    <div>
      {user.userName}
      {!!role && <span>{` (${role})`}</span>}
      <Tooltip title={`${user.userName} entfernen`}>
        <IconButton
          aria-label={`${user.userName} entfernen`}
          onClick={onClickDelete}
          className={delIcon}
        >
          <FaTimes />
        </IconButton>
      </Tooltip>
    </div>
  )
})
