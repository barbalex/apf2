import { memo, useCallback, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { FaTimes } from 'react-icons/fa'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'
import { gql } from '@apollo/client'

import { useApolloClient } from '@apollo/client/react'

import { MobxContext } from '../../../../../mobxContext.js'

const DelIcon = styled(IconButton)`
  font-size: 1rem !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
`

export const ApUser = memo(
  observer(({ user, refetch }) => {
    const apolloClient = useApolloClient()
    const { enqueNotification } = useContext(MobxContext)

    const onClickDelete = useCallback(async () => {
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
          options: {
            variant: 'error',
          },
        })
      }
      refetch()
    }, [apolloClient, enqueNotification, refetch, user.id])

    const role = (user?.userByUserName?.role ?? '').replace('apflora_', '')

    // non-managers do not see role, so don't show it if there is none
    return (
      <div>
        {user.userName}
        {!!role && <span>{` (${role})`}</span>}
        <Tooltip title={`${user.userName} entfernen`}>
          <DelIcon
            aria-label={`${user.userName} entfernen`}
            onClick={onClickDelete}
          >
            <FaTimes />
          </DelIcon>
        </Tooltip>
      </div>
    )
  }),
)
