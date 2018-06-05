// @flow
import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import get from 'lodash/get'

import ErrorBoundary from '../shared/ErrorBoundary'
import userGql from './user.graphql'
import messagesGql from './messages.graphql'
import createUsermessage from './createUsermessage.graphql'

const StyledDialog = styled(Dialog)`
  > div {
    max-width: ${window.innerWidth * 0.8}px !important;
  }
  > div > div {
    overflow: auto;
  }
`
const MessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${props => (props.paddBottom ? '24px' : 0)};
  padding-left: 24px;
  padding-right: 15px;
`
const AllOkButton = styled(Button)`
  position: absolute !important;
  top: 25px;
  right: 25px;
`

const enhance = compose(
  withHandlers({
    onClickRead: () => async (message, userName, client, refetch) => {
      await client.mutate({
        mutation: createUsermessage,
        variables: { userName, id: message.id },
      })
      refetch()
    },
    onClickReadAll: () => async (unreadMessages, userName, client, refetch) => {
      await unreadMessages.forEach(message => {
        client.mutate({
          mutation: createUsermessage,
          variables: { userName, id: message.id }
        })
      })
      refetch()
    },
  }),
)

const UserMessages = ({
  open,
  onClickRead,
  onClickReadAll,
}: {
  open: Boolean,
  onClickRead: () => {},
  onClickReadAll: () => {},
}) =>
  <Query query={userGql}>
    {({ error, data: userData }) => {
      if (error) return `Fehler: ${error.message}`

      const userName = get(userData, 'user.name')

      return (
        <Query query={messagesGql} variables={{ name: userName }}>
          {({ loading, error, data: messagesData, client, refetch  }) => {
            if (error) return `Fehler: ${error.message}`

            const allMessages = get(messagesData, 'allMessages.nodes', [])
            const unreadMessages = allMessages.filter(m => get(m, 'usermessagesByMessageId.nodes').length === 0)
            const updateAvailable = get(messagesGql, 'updateAvailable')

            return (
              <ErrorBoundary>
                <StyledDialog
                  open={
                    unreadMessages.length > 0 &&
                    !!userName &&
                    // do not open if update is available
                    updateAvailable === false
                  }
                  aria-labelledby="dialog-title"
                >
                  <DialogTitle id="dialog-title">Letzte Anpassungen:</DialogTitle>
                  <div>
                    <AllOkButton onClick={() => onClickReadAll(unreadMessages, userName, client, refetch)}>alle o.k.</AllOkButton>
                    {unreadMessages.map((m, index) => {
                      const paddBottom = index < unreadMessages.length - 1
                      return (
                        <MessageContainer key={m.id} paddBottom={paddBottom}>
                          <div>{m.message}</div>
                          <Button onClick={() => onClickRead(m, userName, client, refetch)}>o.k.</Button>
                        </MessageContainer>
                      )
                    })}
                  </div>
                </StyledDialog>
              </ErrorBoundary>
            )
          }}
        </Query>
      )
    }}
  </Query>

export default enhance(UserMessages)
