import { useSetAtom } from 'jotai'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import styles from './ApUser.module.css'

import type { ApUserId } from '../../../../../models/apflora/ApUser.ts'

import {
  addNotificationAtom,
} from '../../../../../store/index.ts'


interface ApUserProps {
  user: {
    id: ApUserId
    userName: string
    userByUserName?: {
      id: string
      role: string
    }
  }
  refetch: () => void
}

export const ApUser = ({ user, refetch }: ApUserProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const apolloClient = useApolloClient()

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
      addNotification({
        message: (error as Error).message,
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
          className={styles.delIcon}
        >
          <FaTimes />
        </IconButton>
      </Tooltip>
    </div>
  )
}
