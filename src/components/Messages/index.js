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
import Linkify from 'react-linkify'

import ErrorBoundary from '../shared/ErrorBoundary'
import userGql from './user.graphql'
import messagesGql from './messages.graphql'
import createUsermessage from './createUsermessage.graphql'

const StyledDialog = styled(Dialog)`
  > div {
    max-width: ${window.innerWidth * 0.8}px !important;
    min-width: 368px !important;
  }
  > div > div {
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
  withHandlers({
    onClickRead: () => async (message, userName, client, refetch) => {
      await client.mutate({
        mutation: createUsermessage,
        variables: { userName, id: message.id },
      })
      refetch()
    },
    onClickReadAll: () => async (unreadMessages, userName, client, refetch) => {
      await Promise.all(
        unreadMessages.map(async message => {
          client.mutate({
            mutation: createUsermessage,
            variables: { userName, id: message.id },
          })
        }),
      )
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
}) => (
  <Query query={userGql}>
    {({ error, data: userData }) => {
      if (error) return `Fehler: ${error.message}`

      const userName = get(userData, 'user.name')

      return (
        <Query query={messagesGql} variables={{ name: userName }}>
          {({ loading, error, data: messagesData, client, refetch }) => {
            if (error) {
              if (error.message.includes('keine Berechtigung')) return null
              return `Fehler: ${error.message}`
            }

            const allMessages = get(messagesData, 'allMessages.nodes', [])
            const unreadMessages = allMessages.filter(
              m => get(m, 'usermessagesByMessageId.nodes', []).length === 0,
            )
            const updateAvailable = get(messagesData, 'updateAvailable')

            return (
              <ErrorBoundary>
                <StyledDialog
                  open={
                    unreadMessages.length > 0 &&
                    !!userName &&
                    // do not open if update is available
                    updateAvailable === false &&
                    // don't show while loading data
                    !loading
                  }
                  aria-labelledby="dialog-title"
                >
                  <TitleRow>
                    <DialogTitle id="dialog-title">
                      Letzte Anpassungen:
                    </DialogTitle>
                    <AllOkButton
                      onClick={() =>
                        onClickReadAll(
                          unreadMessages,
                          userName,
                          client,
                          refetch,
                        )
                      }
                    >
                      alle o.k.
                    </AllOkButton>
                  </TitleRow>
                  <div>
                    {unreadMessages.map((m, index) => {
                      const paddBottom = index === unreadMessages.length - 1
                      return (
                        <MessageRow key={m.id} paddBottom={paddBottom}>
                          <Linkify properties={{ target: '_blank' }}>
                            <MessageDiv>{m.message}</MessageDiv>
                          </Linkify>
                          <OkButton
                            onClick={() =>
                              onClickRead(m, userName, client, refetch)
                            }
                          >
                            o.k.
                          </OkButton>
                        </MessageRow>
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
)

export default enhance(UserMessages)
