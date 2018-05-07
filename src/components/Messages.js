// @flow
import React from 'react'
import { observer, inject } from 'mobx-react'
import Dialog, { DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

import ErrorBoundary from './shared/ErrorBoundary'

const StyledDialog = styled(Dialog)`
  > div > div {
    max-width: ${window.innerWidth * 0.8}px;
    min-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 24px;
    padding-left: 24px;
    overflow: auto;
    > div {
      padding-bottom: 8px;
    }
  }
`
const MessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${props => (props.paddBottom ? '20px' : 0)};
`
const AllOkButton = styled(Button)`
  position: absolute !important;
  top: 25px;
  right: 25px;
`

const enhance = compose(
  inject('store'),
  withHandlers({
    onClickRead: props => message => props.store.messages.setRead(message),
    onClickReadAll: props => () => {
      const { messages, setRead } = props.store.messages
      messages.forEach(message => setRead(message))
    },
  }),
  observer
)

const UserMessages = ({
  store,
  open,
  onClickRead,
  onClickReadAll,
}: {
  store: Object,
  open: boolean,
  onClickRead: () => {},
  onClickReadAll: () => {},
}) => {
  return (
    <ErrorBoundary>
      <StyledDialog
        open={
          store.messages.messages.length > 0 &&
          !!store.user.name &&
          store.updateAvailable === false
        }
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">Letzte Anpassungen:</DialogTitle>
        <div>
          <AllOkButton onClick={onClickReadAll}>alle o.k.</AllOkButton>
          {store.messages.messages.sort(m => m.time).map((m, index) => {
            const paddBottom = index < store.messages.messages.length - 1
            return (
              <MessageContainer key={m.id} paddBottom={paddBottom}>
                <div>{m.message}</div>
                <Button onClick={() => onClickRead(m)}>o.k.</Button>
              </MessageContainer>
            )
          })}
        </div>
      </StyledDialog>
    </ErrorBoundary>
  )
}

export default enhance(UserMessages)
