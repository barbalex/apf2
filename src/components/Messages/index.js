import React, { useCallback, useContext, useMemo } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import get from 'lodash/get'
import Linkify from 'react-linkify'
import { useApolloClient, useQuery } from '@apollo/client'
import { observer } from 'mobx-react-lite'
import { DateTime } from 'luxon'

import query from './data'
import createUsermessage from './createUsermessage'
import storeContext from '../../storeContext'
import Error from '../shared/Error'
import ErrorBoundary from '../shared/ErrorBoundary'

const StyledDialog = styled(Dialog)`
  > div > div {
    max-width: ${typeof window !== 'undefined'
      ? window.innerWidth * 0.8
      : 0}px !important;
    min-width: 368px !important;
  }
  > div > div > div {
    overflow: auto;
  }
`
const MessageRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${(props) => (props.paddBottom ? '24px' : 0)};
  padding-left: 24px;
  padding-right: 15px;
  min-height: 36px;
`
const MessageDiv = styled.div`
  padding-top: 8px;
  padding-right: 15px;
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
const OkButton = styled(Button)`
  position: relative !important;
  right: 12px;
`

const UserMessages = () => {
  const client = useApolloClient()
  const store = useContext(storeContext)
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
  const userNames = (get(data, 'allUsers.nodes') || []).map((u) => u.name)
  const userNameExists = userNames.includes(userName)
  // DANGER: if no userName or non-existing, results are returned!
  const allMessages =
    userName && userNameExists ? get(data, 'allMessages.nodes', []) : []
  const unreadMessages = allMessages.filter(
    (m) => get(m, 'usermessagesByMessageId.totalCount', 0) === 0,
  )

  const onClickRead = useCallback(
    async (message) => {
      await client.mutate({
        mutation: createUsermessage,
        variables: { userName, id: message.id },
        refetchQueries: ['UsermessagesQuery'],
      })
    },
    [client, userName],
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

  if (error) {
    const errors = [error]
    console.log('Messages, error:', error.message)
    return <Error errors={errors} />
  }

  return (
    <ErrorBoundary>
      <StyledDialog
        open={unreadMessages.length > 0 && !!userName && !loading}
        aria-labelledby="dialog-title"
      >
        <TitleRow>
          <DialogTitle id="dialog-title">Letzte Anpassungen:</DialogTitle>
          <AllOkButton onClick={onClickReadAll}>alle o.k.</AllOkButton>
        </TitleRow>
        <div>
          {unreadMessages.map((m, index) => {
            const paddBottom = index === unreadMessages.length - 1
            const date = DateTime.fromISO(m.time).toFormat('yyyy.LL.dd')

            return (
              <MessageRow key={m.id} paddBottom={paddBottom}>
                <Linkify properties={{ target: '_blank' }}>
                  <MessageDiv>{`${date}: ${m.message}`}</MessageDiv>
                </Linkify>
                <OkButton onClick={() => onClickRead(m)}>o.k.</OkButton>
              </MessageRow>
            )
          })}
        </div>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default observer(UserMessages)
