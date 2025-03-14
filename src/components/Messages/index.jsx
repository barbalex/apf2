import { memo, useCallback, useContext, useMemo } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import styled from '@emotion/styled'
import { useApolloClient, useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { query } from './query.js'
import { createUsermessage } from './createUsermessage.js'
import { MobxContext } from '../../mobxContext.js'
import { Error } from '../shared/Error.jsx'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'
import { MessagesList } from './Messages/index.jsx'

const StyledDialog = styled(Dialog)`
  display: flex;
  flex-direction: column;
  > div > div {
    max-width: ${window.innerWidth * 0.8}px !important;
    min-width: 368px !important;
    min-width: 80% !important;
  }
`
const TitleRow = styled.div`
  padding-bottom: 5px;
  overflow: visible !important;
`
const AllOkButton = styled(Button)`
  position: absolute !important;
  top: 20px;
  right: 25px;
`

export const Messages = memo(
  observer(() => {
    const client = useApolloClient()
    const store = useContext(MobxContext)
    const { user } = store
    const userName = user.name

    const aYearAgo = useMemo(() => {
      const now = new Date()
      now.setDate(now.getDate() - 365)
      return now.toISOString()
    }, [])

    const { data, error, loading, refetch } = useQuery(query, {
      fetchPolicy: 'network-only',
      variables: { name: userName, aYearAgo },
    })
    // ensure username exists
    const userNames = (data?.allUsers?.nodes ?? []).map((u) => u.name)
    const userNameExists = userNames.includes(userName)
    // DANGER: if no userName or non-existing, results are returned!
    const allMessages =
      userName && userNameExists ? (data?.allMessages?.nodes ?? []) : []
    const unreadMessages = allMessages.filter(
      (m) => (m?.usermessagesByMessageId?.totalCount ?? 0) === 0,
    )

    const onClickReadAll = useCallback(async () => {
      await Promise.all(
        unreadMessages.map(async (message) => {
          await client.mutate({
            mutation: createUsermessage,
            variables: { userName, id: message.id },
          })
        }),
      )
      return refetch()
    }, [client, refetch, unreadMessages, userName])

    if (error) return <Error error={error} />

    return (
      <ErrorBoundary>
        <StyledDialog
          open={unreadMessages.length > 0 && !!userName && !loading}
          aria-labelledby="dialog-title"
        >
          <TitleRow>
            <DialogTitle id="dialog-title">Letzte Anpassungen:</DialogTitle>
            <AllOkButton
              onClick={onClickReadAll}
              color="inherit"
            >
              alle o.k.
            </AllOkButton>
          </TitleRow>
          <MessagesList unreadMessages={unreadMessages} />
        </StyledDialog>
      </ErrorBoundary>
    )
  }),
)
