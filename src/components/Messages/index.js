// @flow
import React, { useCallback, useContext } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import styled from 'styled-components'
import get from 'lodash/get'
import Linkify from 'react-linkify'
import { withApollo } from 'react-apollo'

import ErrorBoundary from '../shared/ErrorBoundary'
import withData from './withData'
import createUsermessage from './createUsermessage'
import mobxStoreContext from '../../mobxStoreContext'

const StyledDialog = styled(Dialog)`
  > div > div {
    max-width: ${window.innerWidth * 0.8}px !important;
    min-width: 368px !important;
  }
  > div > div > div {
    overflow: auto;
  }
`
const MessageRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${props => (props.paddBottom ? '24px' : 0)};
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

const enhance = compose(
  withApollo,
  withProps(() => useContext(mobxStoreContext)),
  withData,
)

const UserMessages = ({
  open,
  data,
  client,
}: {
  open: Boolean,
  data: Object,
  client: Object,
}) => {
  const { user } = useContext(mobxStoreContext)
  const userName = user.name
  const allMessages = get(data, 'allMessages.nodes', [])
  const unreadMessages = allMessages.filter(
    m => get(m, 'usermessagesByMessageId.nodes', []).length === 0,
  )
  const updateAvailable = get(data, 'updateAvailable')

  const onClickRead = useCallback(
    async message => {
      await client.mutate({
        mutation: createUsermessage,
        variables: { userName, id: message.id },
      })
      data.refetch()
    },
    [userName],
  )
  const onClickReadAll = useCallback(
    async () => {
      await Promise.all(
        unreadMessages.map(async message => {
          await client.mutate({
            mutation: createUsermessage,
            variables: { userName, id: message.id },
          })
        }),
      )
      return data.refetch()
    },
    [unreadMessages, userName],
  )

  if (data.error) {
    if (data.error.message.includes('keine Berechtigung')) return null
    return `Fehler: ${data.error.message}`
  }

  return (
    <ErrorBoundary>
      <StyledDialog
        open={
          unreadMessages.length > 0 &&
          !!userName &&
          // do not open if update is available
          updateAvailable === false &&
          // don't show while loading data
          !data.loading
        }
        aria-labelledby="dialog-title"
      >
        <TitleRow>
          <DialogTitle id="dialog-title">Letzte Anpassungen:</DialogTitle>
          <AllOkButton onClick={onClickReadAll}>alle o.k.</AllOkButton>
        </TitleRow>
        <div>
          {unreadMessages.map((m, index) => {
            const paddBottom = index === unreadMessages.length - 1
            return (
              <MessageRow key={m.id} paddBottom={paddBottom}>
                <Linkify properties={{ target: '_blank' }}>
                  <MessageDiv>{m.message}</MessageDiv>
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

export default enhance(UserMessages)
