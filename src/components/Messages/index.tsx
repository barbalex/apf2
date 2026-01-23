import { Suspense } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { query } from './query.ts'
import { createUsermessage } from './createUsermessage.ts'
import { userNameAtom } from '../../store/index.ts'
import { Error } from '../shared/Error.tsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.tsx'
import { MessagesList } from './Messages/index.tsx'
import { a } from '../Projekte/Karte/layers/Pop/statusGroup/a.ts'

import type { MessageId } from '../../models/apflora/public/Message.ts'
import type { UserId } from '../../models/apflora/public/User.ts'

import styles from './index.module.css'

interface MessageNode {
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

const StyledDialog = styled((props) => <Dialog {...props} />)(() => ({
  display: 'flex',
  flexDirection: 'column',
  '& .MuiPaper-root': {
    maxWidth: `${window.innerWidth * 0.8}px !important`,
    minWidth: '80% !important',
  },
}))

const getAYearAgo = () => {
  const now = new Date()
  now.setDate(now.getDate() - 365)
  return now.toISOString()
}

const aYearAgo = getAYearAgo()

export const Messages = () => {
  const userName = useAtomValue(userNameAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  // DO NOT use aYearAgo in queryKey, because it changes every second
  // this causes the query to refetch all the time!
  const { data, error, refetch } = useQuery({
    queryKey: ['UsermessagesQuery', userName],
    queryFn: async () =>
      apolloClient.query({
        query,
        variables: { name: userName, aYearAgo },
        fetchPolicy: 'network-only',
      }),
  })
  // ensure username exists
  const userNames = (data?.data?.allUsers?.nodes ?? []).map((u) => u.name)
  const userNameExists = userNames.includes(userName)
  // DANGER: if no userName or non-existing, results are returned!
  const allMessages =
    userName && userNameExists ? (data?.data?.allMessages?.nodes ?? []) : []
  const unreadMessages = allMessages.filter(
    (m) => (m?.usermessagesByMessageId?.totalCount ?? 0) === 0,
  )

  const onClickReadAll = async () => {
    await Promise.all(
      unreadMessages.map(async (message) => {
        await apolloClient.mutate({
          mutation: createUsermessage,
          variables: { userName, id: message.id },
        })
      }),
    )
    return refetch()
  }

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <StyledDialog
          open={unreadMessages.length > 0 && !!userName}
          aria-labelledby="dialog-title"
        >
          <div className={styles.titleRow}>
            <DialogTitle id="dialog-title">Letzte Anpassungen:</DialogTitle>
            <Button
              onClick={onClickReadAll}
              color="inherit"
              className={styles.allOkButton}
            >
              alle o.k.
            </Button>
          </div>
          <MessagesList unreadMessages={unreadMessages} />
        </StyledDialog>
      </Suspense>
    </ErrorBoundary>
  )
}
