import { apiFetch, apiInsert } from '../../modules/api.ts'
import { v7 as uuidv7 } from 'uuid'
import Dialog, { type DialogProps } from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { userNameAtom } from '../../store/index.ts'
import { Error } from '../shared/Error.tsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'
import { MessagesList } from './Messages/index.tsx'

import type { MessageId } from '../../models/apflora/Message.ts'
import type { UserId } from '../../models/apflora/User.ts'

import styles from './index.module.css'

export interface MessageNode {
  id: MessageId
  message: string | null
  time: string | null
  usermessagesByMessageId: {
    totalCount: number
  }
}

interface UserNode {
  id: UserId
  name: string | null
}

interface UsermessagesQueryResult {
  allMessages: {
    nodes: MessageNode[]
  }
  allUsers: {
    nodes: UserNode[]
  }
}

const StyledDialog = styled((props: DialogProps) => <Dialog {...props} />)(
  () => ({
    display: 'flex',
    flexDirection: 'column',
    '& .MuiPaper-root': {
      maxWidth: `${window.innerWidth * 0.8}px !important`,
      minWidth: '80% !important',
    },
  }),
)

const getAYearAgo = () => {
  const now = new Date()
  now.setDate(now.getDate() - 365)
  return now.toISOString()
}

const aYearAgo = getAYearAgo()

export const Messages = () => {
  const userName = useAtomValue(userNameAtom)

  // DO NOT use aYearAgo in queryKey, because it changes every second
  // this causes the query to refetch all the time!
  const { data, error, refetch } = useQuery({
    queryKey: ['UsermessagesQuery', userName],
    queryFn: async () => {
      // phase 5: read messages + the user's usermessages join client-side
      const [messagesR, usermessagesR, usersR] = await Promise.all([
        apiFetch<
          {
            id: string
            message: string | null
            time: string | null
          }[]
        >(
          `/message?active=eq.true&time=gte.${aYearAgo}&select=id,message,time&order=time.asc`,
        ),
        apiFetch<{ message_id: string }[]>(
          `/usermessage?user_name=eq.${encodeURIComponent(userName)}&select=message_id:message_id`,
        ),
        apiFetch<{ id: string; name: string | null }[]>('/user?select=id,name'),
      ])
      const readIds = new Set((usermessagesR ?? []).map((u) => u.message_id))
      const nodes = (messagesR ?? []).map((m) => ({
        id: m.id,
        message: m.message,
        time: m.time,
        usermessagesByMessageId: {
          totalCount: readIds.has(m.id) ? 1 : 0,
        },
      }))
      return {
        allMessages: { nodes },
        allUsers: { nodes: usersR ?? [] },
      } as unknown as UsermessagesQueryResult
    },
  })
  // ensure username exists
  const userNames = (data?.allUsers?.nodes ?? []).map((u) => u?.name)
  const userNameExists = userNames.includes(userName)
  // DANGER: if no userName or non-existing, results are returned!
  const allMessages =
    userName && userNameExists ? (data?.allMessages?.nodes ?? []) : []
  const unreadMessages = allMessages.filter(
    (m) => (m?.usermessagesByMessageId?.totalCount ?? 0) === 0,
  )

  const onClickReadAll = async () => {
    await Promise.all(
      unreadMessages.map(async (message) => {
        await apiInsert('usermessage', {
          id: uuidv7(),
          user_name: userName,
          message_id: message.id,
        })
      }),
    )
    return refetch()
  }

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <StyledDialog
        open={unreadMessages.length > 0 && !!userName}
        aria-labelledby="dialog-title"
      >
        <div className={styles.titleRow}>
          <DialogTitle id="dialog-title">Letzte Anpassungen:</DialogTitle>
          <Button
            onClick={() => void onClickReadAll()}
            color="inherit"
            className={styles.allOkButton}
          >
            alle o.k.
          </Button>
        </div>
        <MessagesList unreadMessages={unreadMessages} />
      </StyledDialog>
    </ErrorBoundary>
  )
}
